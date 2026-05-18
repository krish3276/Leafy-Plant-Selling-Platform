import React, { useEffect, useState } from 'react';
import { Leaf, Heart, Award, Users, Sprout, Zap, BookOpen } from 'lucide-react';
import '../styles/About.css';

const growthStages = [
  {
    title: 'Seed',
    description: 'A small seed settles into the soil and gathers energy.',
  },
  {
    title: 'Sprout',
    description: 'A tiny shoot pushes upward and reaches for the light.',
  },
  {
    title: 'Stem',
    description: 'The stem lengthens and steadies itself above the soil.',
  },
  {
    title: 'Leaves',
    description: 'Leaves unfold, opening the plant to the warmth of the sun.',
  },
  {
    title: 'Plant',
    description: 'A healthy young plant stands upright and gently sways.',
  },
];

function GrowingPlantAnimation() {
  const [stageIndex, setStageIndex] = useState(0);
  const [replayToken, setReplayToken] = useState(0);

  useEffect(() => {
    const timers = [1200, 2800, 4600, 7000].map((delay, index) => (
      window.setTimeout(() => setStageIndex(index + 1), delay)
    ));

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [replayToken]);

  const resetGrowth = () => {
    setStageIndex(0);
    setReplayToken((value) => value + 1);
  };

  const stage = growthStages[stageIndex];

  return (
    <div className="growing-plant-animation">
      <div className="growth-sun" aria-hidden="true">
        <span className="sun-core" />
        <span className="sun-ray ray-1" />
        <span className="sun-ray ray-2" />
        <span className="sun-ray ray-3" />
        <span className="sun-ray ray-4" />
        <span className="sun-ray ray-5" />
        <span className="sun-ray ray-6" />
      </div>

      <div className="growth-scene" aria-hidden="true">
        <div className={`soil-bed stage-${stageIndex}`}>
          <div className="soil-shadow" />
          <div className="soil-mound" />

          <div className={`seed ${stageIndex === 0 ? 'is-visible' : 'is-buried'}`} />

          <div className={`sprout ${stageIndex >= 1 ? 'is-visible' : ''}`}>
            <span className="sprout-stem" />
            <span className="sprout-leaf sprout-leaf-left" />
            <span className="sprout-leaf sprout-leaf-right" />
          </div>

          <svg
            className={`plant-svg ${stageIndex >= 2 ? 'is-visible' : ''}`}
            viewBox="0 0 220 220"
            role="img"
            aria-label="Growing plant"
          >
            <path
              className={`stem-path ${stageIndex >= 2 ? 'draw' : ''}`}
              d="M110 184 C109 156 108 136 110 118 C112 98 114 81 116 66"
            />
            <path
              className={`branch-path branch-left ${stageIndex >= 2 ? 'draw' : ''}`}
              d="M110 138 C96 128 84 116 73 102"
            />
            <path
              className={`branch-path branch-right ${stageIndex >= 2 ? 'draw' : ''}`}
              d="M112 132 C126 122 140 111 152 98"
            />
            <path
              className={`leaf leaf-left ${stageIndex >= 3 ? 'bloom' : ''} ${stageIndex >= 4 ? 'sway' : ''}`}
              d="M73 102 C50 96 41 76 52 63 C67 47 91 66 87 88 C84 96 79 100 73 102 Z"
            />
            <path
              className={`leaf leaf-right ${stageIndex >= 3 ? 'bloom' : ''} ${stageIndex >= 4 ? 'sway' : ''}`}
              d="M152 98 C175 91 185 71 174 59 C159 43 135 61 139 84 C142 92 147 96 152 98 Z"
            />
            <path
              className={`leaf leaf-lower-left ${stageIndex >= 3 ? 'bloom' : ''} ${stageIndex >= 4 ? 'sway' : ''}`}
              d="M108 144 C92 140 80 126 84 112 C89 97 108 104 114 121 C115 131 112 139 108 144 Z"
            />
            <path
              className={`leaf leaf-lower-right ${stageIndex >= 3 ? 'bloom' : ''} ${stageIndex >= 4 ? 'sway' : ''}`}
              d="M116 142 C132 138 145 125 141 111 C136 96 117 103 111 120 C110 130 112 138 116 142 Z"
            />
            <path
              className={`leaf leaf-top ${stageIndex >= 3 ? 'bloom' : ''} ${stageIndex >= 4 ? 'sway' : ''}`}
              d="M110 91 C100 77 101 58 112 50 C124 58 125 77 116 91 C114 94 111 94 110 91 Z"
            />
          </svg>

          <div className={`watering-drop drop-one ${stageIndex >= 1 ? 'fall' : ''}`} />
          <div className={`watering-drop drop-two ${stageIndex >= 2 ? 'fall' : ''}`} />
        </div>
      </div>

      <div className="growth-caption">
        <span className="growth-stage-badge">{stage.title}</span>
        <p>{stage.description}</p>
      </div>

      <button type="button" className="growth-replay" onClick={resetGrowth}>
        Replay Growth
      </button>
    </div>
  );
}

function About() {
  const whyChooseUs = [
    {
      id: 1,
      icon: <Award size={40} />,
      title: 'Premium Quality Plants',
      description: 'We carefully select and nurture each plant to ensure they arrive at your doorstep healthy and vibrant, ready to thrive in your home.'
    },
    {
      id: 2,
      icon: <Leaf size={40} />,
      title: 'Expert Care Support',
      description: 'Our AI-powered plant care guides and expert tips help you become a successful plant parent, no matter your experience level.'
    },
    {
      id: 3,
      icon: <Heart size={40} />,
      title: 'Eco-Friendly Practices',
      description: 'We are committed to sustainability with organic soil, biodegradable packaging, and responsible sourcing of all our plants.'
    },
    {
      id: 4,
      icon: <Users size={40} />,
      title: 'Community Support',
      description: 'Join our growing community of plant enthusiasts. Share your experiences, get advice, and celebrate your green space journey with us.'
    }
  ];

  const whatWeProvide = [
    {
      id: 1,
      icon: <Sprout size={32} />,
      title: 'Wide Plant Selection',
      description: 'From low-maintenance succulents to elegant tropical plants, we offer diverse species for every space and skill level.'
    },
    {
      id: 2,
      icon: <Zap size={32} />,
      title: 'Fast & Safe Delivery',
      description: 'Quick shipping with special packaging to ensure your plants arrive in perfect condition, safely protected during transit.'
    },
    {
      id: 3,
      icon: <BookOpen size={32} />,
      title: 'Comprehensive Guides',
      description: 'Detailed care instructions, watering schedules, and troubleshooting tips for every plant species we offer.'
    },
    {
      id: 4,
      icon: <Award size={32} />,
      title: 'Quality Guarantee',
      description: 'We stand behind our products with a satisfaction guarantee. If your plant doesn\'t thrive, we\'re here to help.'
    }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1 className="about-hero-title">Welcome to Leafy</h1>
          <p className="about-hero-subtitle">
            Bringing Nature Into Your Home, One Plant at a Time
          </p>
        </div>
      </section>

      {/* Company Story Section */}
      <section className="company-story">
        <div className="story-container">
          <div className="story-content">
            <h2 className="section-title">Our Story</h2>
            <p className="story-paragraph">
              Leafy was born from a simple passion: making plant parenting accessible and enjoyable for everyone. 
              We believe that plants have the power to transform spaces, improve air quality, and bring joy into our daily lives.
            </p>
            <p className="story-paragraph">
              Starting as a small plant nursery, we've grown into a trusted online platform dedicated to connecting 
              plant lovers with carefully curated, healthy specimens. Today, we're proud to serve thousands of happy plant parents 
              across the region, helping them build thriving green spaces in their homes and offices.
            </p>
            <p className="story-paragraph">
              With our innovative AI-powered care guidance and expert support, we're not just selling plants – 
              we're building a community of nature enthusiasts committed to sustainable living and plant wellness.
            </p>
          </div>
          <div className="story-image">
            <div className="story-image-placeholder">
              <GrowingPlantAnimation />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose">
        <div className="why-container">
          <h2 className="section-title">Why Choose Leafy?</h2>
          <p className="why-subtitle">
            Experience the difference of working with plant experts who genuinely care about your success
          </p>
          <div className="why-grid">
            {whyChooseUs.map((item) => (
              <div key={item.id} className="why-card">
                <div className="why-icon">{item.icon}</div>
                <h3 className="why-title">{item.title}</h3>
                <p className="why-description">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Provide Section */}
      <section className="what-we-provide">
        <div className="provide-container">
          <h2 className="section-title">What We Provide</h2>
          <p className="provide-subtitle">
            Everything you need to start and succeed in your plant parenting journey
          </p>
          <div className="provide-grid">
            {whatWeProvide.map((item) => (
              <div key={item.id} className="provide-card">
                <div className="provide-icon">{item.icon}</div>
                <h3 className="provide-title">{item.title}</h3>
                <p className="provide-description">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Values Section */}
      <section className="mission-values">
        <div className="mission-container">
          <h2 className="section-title">Our Mission & Values</h2>
          <div className="mission-grid">
            <div className="mission-card">
              <h3 className="mission-heading">🌱 Our Mission</h3>
              <p className="mission-text">
                To empower plant lovers with premium quality plants, expert knowledge, and community support, 
                making it easy for everyone to create beautiful, thriving green spaces in their homes and workplaces.
              </p>
            </div>
            <div className="mission-card">
              <h3 className="mission-heading">💚 Our Values</h3>
              <ul className="values-list">
                <li><strong>Quality:</strong> We offer only the healthiest, most vibrant plants</li>
                <li><strong>Sustainability:</strong> Eco-friendly practices in every step</li>
                <li><strong>Expertise:</strong> Sharing knowledge to help you succeed</li>
                <li><strong>Community:</strong> Building connections among plant enthusiasts</li>
                <li><strong>Transparency:</strong> Honest information about our products and services</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="about-stats">
        <div className="stats-container">
          <div className="stat-item">
            <h3 className="stat-number">5K+</h3>
            <p className="stat-label">Happy Customers</p>
          </div>
          <div className="stat-item">
            <h3 className="stat-number">500+</h3>
            <p className="stat-label">Plant Varieties</p>
          </div>
          <div className="stat-item">
            <h3 className="stat-number">100%</h3>
            <p className="stat-label">Organic & Healthy</p>
          </div>
          <div className="stat-item">
            <h3 className="stat-number">24/7</h3>
            <p className="stat-label">Expert Support</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="cta-container">
          <h2 className="cta-title">Ready to Start Your Green Journey?</h2>
          <p className="cta-subtitle">
            Browse our collection and find the perfect plants for your space
          </p>
          <a href="/shop" className="cta-button">Explore Our Plants</a>
        </div>
      </section>
    </div>
  );
}

export default About;
