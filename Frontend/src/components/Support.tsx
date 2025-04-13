import React, { useState } from 'react';
import { MessageCircle, Phone, Mail, HelpCircle } from 'lucide-react';

function Support() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [message, setMessage] = useState('');

  const faqs = [
    {
      question: 'How do I schedule an appointment?',
      answer: 'You can schedule an appointment by clicking on the "Appointments" tab in the sidebar and then clicking on "Schedule New Appointment". Follow the prompts to select your preferred doctor, date, and time.'
    },
    {
      question: 'How can I view my medical records?',
      answer: 'Your medical records can be accessed through the "Records" tab in the sidebar. There you can view, download, and manage all your medical documents and test results.'
    },
    {
      question: 'What should I do if I need urgent medical attention?',
      answer: 'If you need urgent medical attention, please call emergency services immediately at 911. This platform is not intended for emergency situations.'
    },
    {
      question: 'How do I update my personal information?',
      answer: 'You can update your personal information by going to the "Settings" tab and selecting "Profile Settings". There you can modify your contact details and other personal information.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Support Center</h1>

      {/* Contact Options */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <MessageCircle className="w-8 h-8 text-teal-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
          <p className="text-gray-400 mb-4">Chat with our support team</p>
          <button className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 w-full">
            Start Chat
          </button>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <Phone className="w-8 h-8 text-teal-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Phone Support</h3>
          <p className="text-gray-400 mb-4">Call us directly</p>
          <p className="text-lg font-semibold text-teal-400">1-800-HEALTH</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <Mail className="w-8 h-8 text-teal-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Email Support</h3>
          <p className="text-gray-400 mb-4">Send us an email</p>
          <p className="text-lg font-semibold text-teal-400">support@healthtrack.com</p>
        </div>
      </div>

      {/* Support Ticket Form */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6">Submit a Support Ticket</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Select a category</option>
              <option value="technical">Technical Issue</option>
              <option value="account">Account Management</option>
              <option value="billing">Billing</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Describe your issue..."
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600"
          >
            Submit Ticket
          </button>
        </form>
      </div>

      {/* FAQs */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center space-x-4 mb-6">
          <HelpCircle className="w-6 h-6 text-teal-400" />
          <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-700 pb-4">
              <h3 className="font-semibold mb-2">{faq.question}</h3>
              <p className="text-gray-400">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Support;