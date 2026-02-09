import { Component } from '@angular/core';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [NavbarComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  features = [
    {
      icon: 'sync',
      title: 'Smart Scheduling',
      description: 'Automatically schedules tasks around your existing calendar events using intelligent algorithms.'
    },
    {
      icon: 'insights',
      title: 'Time Optimization',
      description: 'Maximize productivity by finding the perfect time slots for your most important tasks.'
    },
    {
      icon: 'integration',
      title: 'Seamless Integration',
      description: 'Works with Google Calendar, Outlook, and other popular calendar platforms.'
    },
    {
      icon: 'analytics',
      title: 'Analytics Dashboard',
      description: 'Track your productivity trends and identify your most productive time blocks.'
    },
    {
      icon: 'collaboration',
      title: 'Team Collaboration',
      description: 'Coordinate schedules across teams and avoid scheduling conflicts.'
    },
    {
      icon: 'mobile',
      title: 'Mobile Ready',
      description: 'Access and manage your schedule from any device, anywhere.'
    }
  ];

  testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Product Manager',
      company: 'TechCorp Inc.',
      content: 'This app saved me 10+ hours per week on scheduling. The automatic task placement around meetings is genius!',
      avatar: 'SJ'
    },
    {
      name: 'Michael Chen',
      role: 'Freelance Consultant',
      company: 'Independent',
      content: 'As someone juggling multiple clients, this tool has been a game-changer for managing my time effectively.',
      avatar: 'MC'
    },
    {
      name: 'Jessica Williams',
      role: 'Marketing Director',
      company: 'Growth Labs',
      content: 'The team scheduling features eliminated all our meeting conflicts. Highly recommended for any growing business.',
      avatar: 'JW'
    }
  ];

  startFreeTrial() {
    // Implement trial signup logic
    console.log('Starting 14-day free trial');
    // Redirect to signup page or open modal
  }

  scrollToFeatures() {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  }
}