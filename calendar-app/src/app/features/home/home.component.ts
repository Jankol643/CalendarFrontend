// home.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface Testimonial {
  content: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
}

interface Benefit {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  features: Feature[] = [
    {
      icon: 'auto_schedule',
      title: 'Smart Scheduling',
      description: 'AI-powered scheduling that finds optimal times for your tasks'
    },
    {
      icon: 'integration_instructions',
      title: 'Calendar Integration',
      description: 'Sync with Google Calendar, Outlook, and other platforms'
    },
    {
      icon: 'team_dashboard',
      title: 'Team Collaboration',
      description: 'Coordinate schedules across your entire team seamlessly'
    },
    {
      icon: 'analytics',
      title: 'Productivity Analytics',
      description: 'Track and optimize your time usage with detailed insights'
    },
    {
      icon: 'notifications_active',
      title: 'Smart Reminders',
      description: 'Get timely notifications and follow-up suggestions'
    },
    {
      icon: 'security',
      title: 'Enterprise Security',
      description: 'Bank-level security with end-to-end encryption'
    }
  ];

  testimonials: Testimonial[] = [
    {
      content: 'This tool saved our team over 10 hours per week on scheduling alone. The ROI was immediate.',
      name: 'Sarah Chen',
      role: 'Operations Manager',
      company: 'TechCorp',
      avatar: 'SC'
    },
    {
      content: 'As a consultant, time is my most valuable asset. This platform has optimized my schedule perfectly.',
      name: 'Michael Rodriguez',
      role: 'Senior Consultant',
      company: 'StrategyPlus',
      avatar: 'MR'
    },
    {
      content: 'The automatic scheduling feature is a game-changer for our remote team coordination.',
      name: 'Jessica Williams',
      role: 'Project Lead',
      company: 'RemoteFirst',
      avatar: 'JW'
    }
  ];

  benefits: Benefit[] = [
    {
      icon: '⏱️',
      title: 'Save 8+ Hours Weekly',
      description: 'Eliminate manual scheduling and reduce administrative overhead by automating task placement.'
    },
    {
      icon: '📈',
      title: 'Increase Team Output',
      description: 'Optimize team schedules to maximize productive hours and minimize context switching.'
    },
    {
      icon: '💰',
      title: 'Boost ROI',
      description: 'Every hour saved on scheduling translates to more billable hours and higher revenue.'
    },
    {
      icon: '🔄',
      title: 'Scale Efficiently',
      description: 'As your business grows, our intelligent scheduling scales with you, maintaining efficiency.'
    }
  ];

  constructor() { }

  ngOnInit(): void { }

  startFreeTrial(): void {
    // Implement trial start logic
    console.log('Starting free trial...');
  }

  scrollToFeatures(): void {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}