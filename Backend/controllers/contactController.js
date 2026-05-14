import ContactMessage from '../models/ContactMessage.js';
import User from '../models/User.js';
import { createNotification } from './notificationController.js';

export const submitContactMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields (name, email, subject, message)',
      });
    }

    // Create the contact message
    const contactMessage = await ContactMessage.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone ? phone.trim() : '',
      subject: subject.trim(),
      message: message.trim(),
      status: 'new',
    });

    // Notify all admins about the new contact message
    try {
      const admins = await User.find({ role: 'admin' }).select('_id firstName lastName email');

      const notificationPayload = {
        type: 'contact_message',
        title: `New Contact Message: ${subject}`,
        message: `New message from ${name} (${email}): ${subject}`,
        relatedId: contactMessage._id,
        relatedType: 'contact',
        data: {
          contactId: contactMessage._id,
          senderName: name,
          senderEmail: email,
          subject: subject,
        },
        priority: 'medium',
      };

      for (const admin of admins) {
        // Create notification without awaiting to avoid delaying response
        createNotification(admin._id, notificationPayload).catch((err) =>
          console.error('Failed to create contact notification:', err)
        );
      }
    } catch (notifyErr) {
      console.error('Error notifying admins about contact message:', notifyErr);
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting us! We\'ll get back to you within 24 hours.',
      contactMessage: {
        _id: contactMessage._id,
        name: contactMessage.name,
        email: contactMessage.email,
        subject: contactMessage.subject,
        createdAt: contactMessage.createdAt,
      },
    });
  } catch (error) {
    console.error('Submit Contact Message Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get all contact messages (admin only)
export const getAllContactMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || 'all';

    const skip = (page - 1) * limit;

    let filter = {};
    if (status !== 'all') {
      filter.status = status;
    }

    const messages = await ContactMessage.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ContactMessage.countDocuments(filter);

    res.status(200).json({
      success: true,
      messages,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get Contact Messages Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get single contact message (admin only)
export const getContactMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found',
      });
    }

    // Mark as read if it was new
    if (message.status === 'new') {
      message.status = 'read';
      await message.save();
    }

    res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    console.error('Get Contact Message Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Update contact message status/notes (admin only)
export const updateContactMessage = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    const message = await ContactMessage.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found',
      });
    }

    if (status) {
      message.status = status;
    }

    if (adminNotes !== undefined) {
      message.adminNotes = adminNotes.trim();
    }

    await message.save();

    res.status(200).json({
      success: true,
      message: 'Contact message updated',
      data: message,
    });
  } catch (error) {
    console.error('Update Contact Message Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Delete contact message (admin only)
export const deleteContactMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contact message deleted',
    });
  } catch (error) {
    console.error('Delete Contact Message Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
