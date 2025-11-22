const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Lead = require('./models/Lead');
const Task = require('./models/Task');
const Meeting = require('./models/Meeting');
const Complaint = require('./models/Complaint');
const Mail = require('./models/Mail');
const connectDB = require('./config/database');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Connect to database
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Lead.deleteMany({});
    await Task.deleteMany({});
    await Meeting.deleteMany({});
    await Complaint.deleteMany({});
    await Mail.deleteMany({});
    console.log('✅ Existing data cleared\n');

    // Create Users
    console.log('👤 Creating users...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Abhi@5254', salt);

    const regularUser = new User({
      name: 'abhilash',
      email: 'abhilashchandra26@gmail.com',
      password: hashedPassword,
      role: 'user',
      isActive: true,
    });
    await regularUser.save();
    console.log('✅ Regular user created: abhilash (abhilashchandra26@gmail.com)');

    const adminUser = new User({
      name: 'abhilash',
      email: 'admin@abhilash.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
    });
    await adminUser.save();
    console.log('✅ Admin user created: abhilash (admin@abhilash.com)\n');

    // Create Leads
    console.log('📊 Creating leads...');
    const leads = [
      {
        name: 'John Smith',
        email: 'john.smith@techcorp.com',
        phone: '+1-555-0101',
        company: 'TechCorp Solutions',
        title: 'CTO',
        status: 'new',
        priority: 'high',
        value: 50000,
        source: 'website',
        assignedTo: regularUser._id,
        createdBy: regularUser._id,
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah.j@innovate.io',
        phone: '+1-555-0102',
        company: 'Innovate Labs',
        title: 'CEO',
        status: 'contacted',
        priority: 'high',
        value: 75000,
        source: 'referral',
        assignedTo: regularUser._id,
        createdBy: regularUser._id,
      },
      {
        name: 'Michael Chen',
        email: 'mchen@dataflow.com',
        phone: '+1-555-0103',
        company: 'DataFlow Inc',
        title: 'VP of Sales',
        status: 'in-progress',
        priority: 'medium',
        value: 35000,
        source: 'social',
        assignedTo: regularUser._id,
        createdBy: regularUser._id,
      },
      {
        name: 'Emily Rodriguez',
        email: 'emily.r@cloudnine.com',
        phone: '+1-555-0104',
        company: 'Cloud Nine Systems',
        title: 'Director of IT',
        status: 'won',
        priority: 'high',
        value: 120000,
        source: 'website',
        assignedTo: regularUser._id,
        createdBy: regularUser._id,
      },
      {
        name: 'David Park',
        email: 'dpark@nextstep.io',
        phone: '+1-555-0105',
        company: 'NextStep Technologies',
        title: 'Product Manager',
        status: 'new',
        priority: 'low',
        value: 15000,
        source: 'phone',
        assignedTo: regularUser._id,
        createdBy: regularUser._id,
      },
      {
        name: 'Lisa Anderson',
        email: 'l.anderson@futuretech.com',
        phone: '+1-555-0106',
        company: 'FutureTech Corp',
        title: 'Marketing Director',
        status: 'contacted',
        priority: 'medium',
        value: 45000,
        source: 'other',
        assignedTo: regularUser._id,
        createdBy: regularUser._id,
      },
      {
        name: 'Robert Taylor',
        email: 'rtaylor@smartsolutions.com',
        phone: '+1-555-0107',
        company: 'Smart Solutions Ltd',
        title: 'Operations Manager',
        status: 'in-progress',
        priority: 'high',
        value: 60000,
        source: 'referral',
        assignedTo: regularUser._id,
        createdBy: regularUser._id,
      },
      {
        name: 'Jennifer Lee',
        email: 'jlee@digitalwave.com',
        phone: '+1-555-0108',
        company: 'Digital Wave Media',
        title: 'Creative Director',
        status: 'lost',
        priority: 'low',
        value: 25000,
        source: 'website',
        assignedTo: regularUser._id,
        createdBy: regularUser._id,
      },
    ];

    await Lead.insertMany(leads);
    console.log(`✅ Created ${leads.length} leads\n`);

    // Create Tasks
    console.log('📝 Creating tasks...');
    const tasks = [
      {
        title: 'Follow up with John Smith',
        description: 'Schedule a demo call to discuss CRM features',
        type: 'call',
        status: 'pending',
        priority: 'high',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        assignedTo: regularUser._id,
        createdBy: regularUser._id,
      },
      {
        title: 'Send proposal to Sarah Johnson',
        description: 'Prepare and send detailed proposal for enterprise plan',
        type: 'email',
        status: 'in-progress',
        priority: 'high',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
        assignedTo: regularUser._id,
        createdBy: regularUser._id,
      },
      {
        title: 'Product demo for Michael Chen',
        description: 'Conduct live product demonstration',
        type: 'demo',
        status: 'pending',
        priority: 'medium',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        assignedTo: regularUser._id,
        createdBy: regularUser._id,
      },
      {
        title: 'Contract review with Emily Rodriguez',
        description: 'Review and finalize contract terms',
        type: 'meeting',
        status: 'completed',
        priority: 'high',
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Yesterday
        assignedTo: regularUser._id,
        createdBy: regularUser._id,
      },
      {
        title: 'Send welcome email to new clients',
        description: 'Send onboarding materials and welcome package',
        type: 'email',
        status: 'pending',
        priority: 'medium',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        assignedTo: regularUser._id,
        createdBy: regularUser._id,
      },
      {
        title: 'Quarterly review meeting',
        description: 'Review Q4 performance and set Q1 goals',
        type: 'meeting',
        status: 'pending',
        priority: 'high',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        assignedTo: regularUser._id,
        createdBy: regularUser._id,
      },
      {
        title: 'Update CRM database',
        description: 'Clean up and update contact information',
        type: 'other',
        status: 'in-progress',
        priority: 'low',
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        assignedTo: regularUser._id,
        createdBy: regularUser._id,
      },
    ];

    await Task.insertMany(tasks);
    console.log(`✅ Created ${tasks.length} tasks\n`);

    // Create Meetings
    console.log('📅 Creating meetings...');
    const meetings = [
      {
        title: 'Sales Strategy Meeting',
        description: 'Discuss Q1 sales strategy and targets',
        startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        location: 'Conference Room A',
        attendees: [regularUser._id],
        createdBy: regularUser._id,
      },
      {
        title: 'Client Onboarding - Emily Rodriguez',
        description: 'Onboarding session for Cloud Nine Systems',
        startTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        location: 'Virtual - Zoom',
        attendees: [regularUser._id],
        createdBy: regularUser._id,
      },
      {
        title: 'Product Demo - Michael Chen',
        description: 'Live product demonstration for DataFlow Inc',
        startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        location: 'Virtual - Google Meet',
        attendees: [regularUser._id],
        createdBy: regularUser._id,
      },
      {
        title: 'Team Sync',
        description: 'Weekly team synchronization meeting',
        startTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        location: 'Office',
        attendees: [regularUser._id, adminUser._id],
        createdBy: adminUser._id,
      },
    ];

    await Meeting.insertMany(meetings);
    console.log(`✅ Created ${meetings.length} meetings\n`);

    // Create Complaints
    console.log('📢 Creating complaints...');
    const complaints = [
      {
        title: 'Login Issues',
        description: 'Unable to login to the system, getting authentication errors',
        status: 'open',
        priority: 'high',
        user: regularUser._id,
      },
      {
        title: 'Slow Dashboard Loading',
        description: 'Dashboard takes too long to load, especially with large datasets',
        status: 'in-progress',
        priority: 'medium',
        user: regularUser._id,
      },
      {
        title: 'Email Notifications Not Working',
        description: 'Not receiving email notifications for new leads',
        status: 'resolved',
        priority: 'medium',
        user: regularUser._id,
      },
      {
        title: 'Export Feature Bug',
        description: 'CSV export is missing some columns',
        status: 'open',
        priority: 'low',
        user: regularUser._id,
      },
    ];

    await Complaint.insertMany(complaints);
    console.log(`✅ Created ${complaints.length} complaints\n`);

    // Summary
    // Create Mail samples
    console.log('\n📧 Creating sample emails...');
    const mails = [];

    // Inbox emails for admin
    const inboxEmails = [
      {
        from: 'abhilashchandra26@gmail.com',
        to: 'admin@abhilash.com',
        subject: 'Welcome to SwiftCRM!',
        body: 'Hi Admin, I am excited to start using SwiftCRM. The platform looks amazing! Looking forward to collaborating with the team.',
        folder: 'inbox',
        read: false,
        starred: true,
        userId: adminUser._id,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        from: 'client@techcorp.com',
        to: 'admin@abhilash.com',
        subject: 'Question about pricing plans',
        body: 'Hello, I would like to know more about your enterprise pricing plans. Can we schedule a call this week?',
        folder: 'inbox',
        read: false,
        starred: false,
        userId: adminUser._id,
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      },
      {
        from: 'support@example.com',
        to: 'admin@abhilash.com',
        subject: 'Monthly Report Available',
        body: 'Your monthly analytics report is now available. You can download it from the dashboard. Great progress this month!',
        folder: 'inbox',
        read: true,
        starred: false,
        userId: adminUser._id,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        from: 'sales@partner.com',
        to: 'admin@abhilash.com',
        subject: 'Partnership Opportunity',
        body: 'We would love to discuss a potential partnership opportunity. Our services complement SwiftCRM perfectly.',
        folder: 'inbox',
        read: false,
        starred: true,
        userId: adminUser._id,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
    ];

    // Sent emails from admin
    const sentEmails = [
      {
        from: 'admin@abhilash.com',
        to: 'abhilashchandra26@gmail.com',
        subject: 'Re: Welcome to SwiftCRM!',
        body: 'Thank you for joining! We are excited to have you on board. Let me know if you need any assistance getting started.',
        folder: 'sent',
        read: true,
        starred: false,
        userId: adminUser._id,
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      },
      {
        from: 'admin@abhilash.com',
        to: 'team@swiftcrm.com',
        subject: 'Weekly Team Update',
        body: 'Great work everyone this week! Our conversion rates are up 25%. Keep up the excellent work!',
        folder: 'sent',
        read: true,
        starred: false,
        userId: adminUser._id,
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
    ];

    // Create inbox emails for regular user
    const userInboxEmails = [
      {
        from: 'admin@abhilash.com',
        to: 'abhilashchandra26@gmail.com',
        subject: 'Re: Welcome to SwiftCRM!',
        body: 'Thank you for joining! We are excited to have you on board. Let me know if you need any assistance getting started.',
        folder: 'inbox',
        read: false,
        starred: false,
        userId: regularUser._id,
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      },
      {
        from: 'notifications@swiftcrm.com',
        to: 'abhilashchandra26@gmail.com',
        subject: 'New Lead Assigned',
        body: 'You have been assigned a new lead: Google Inc. Please follow up within 24 hours.',
        folder: 'inbox',
        read: true,
        starred: true,
        userId: regularUser._id,
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      },
    ];

    // Combine and save all emails
    const allEmails = [...inboxEmails, ...sentEmails, ...userInboxEmails];
    for (const emailData of allEmails) {
      const email = new Mail(emailData);
      await email.save();
      mails.push(email);
    }
    console.log(`✅ Created ${mails.length} sample emails`);

    console.log('\n═══════════════════════════════════════════');
    console.log('✨ Database seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   • Users: 2 (1 regular user, 1 admin)`);
    console.log(`   • Leads: ${leads.length}`);
    console.log(`   • Tasks: ${tasks.length}`);
    console.log(`   • Meetings: ${meetings.length}`);
    console.log(`   • Complaints: ${complaints.length}`);
    console.log(`   • Emails: ${mails.length}\n`);
    console.log('🔐 Login Credentials:');
    console.log('   Regular User:');
    console.log('   📧 Email: abhilashchandra26@gmail.com');
    console.log('   🔑 Password: Abhi@5254\n');
    console.log('   Admin User:');
    console.log('   📧 Email: admin@abhilash.com');
    console.log('   🔑 Password: Abhi@5254');
    console.log('═══════════════════════════════════════════\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err.message);
    console.error(err);
    process.exit(1);
  }
};

seedDatabase();
