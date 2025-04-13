import React, { useState } from 'react';
import { Calendar, Clock, User, MapPin, X, Plus, AlertTriangle } from 'lucide-react';

function Appointments() {
  const [selectedTab, setSelectedTab] = useState('upcoming');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [error, setError] = useState('');
  const [scheduleForm, setScheduleForm] = useState({
    doctor: '',
    specialty: '',
    date: '',
    time: '',
    location: '',
    reason: ''
  });

  const specialties = [
    'General Physician',
    'Cardiologist',
    'Dermatologist',
    'Neurologist',
    'Orthopedist',
    'Pediatrician',
    'Psychiatrist',
    'Nutritionist'
  ];

  const locations = [
    'Main Hospital',
    'Medical Plaza',
    'Heart Care Center',
    'Wellness Center',
    'Children\'s Clinic'
  ];

  const [upcomingAppointments, setUpcomingAppointments] = useState([
    {
      id: 1,
      doctor: 'Dr. Sarah Smith',
      specialty: 'Cardiologist',
      date: '2024-03-20',
      time: '10:00 AM',
      location: 'Heart Care Center',
      status: 'Confirmed'
    },
    {
      id: 2,
      doctor: 'Dr. Michael Johnson',
      specialty: 'General Physician',
      date: '2024-03-22',
      time: '2:30 PM',
      location: 'Medical Plaza',
      status: 'Pending'
    },
    {
      id: 3,
      doctor: 'Dr. Emily Brown',
      specialty: 'Nutritionist',
      date: '2024-03-25',
      time: '11:15 AM',
      location: 'Wellness Center',
      status: 'Confirmed'
    }
  ]);

  const pastAppointments = [
    {
      id: 4,
      doctor: 'Dr. James Wilson',
      specialty: 'Cardiologist',
      date: '2024-03-10',
      time: '9:00 AM',
      location: 'Heart Care Center',
      status: 'Completed'
    },
    {
      id: 5,
      doctor: 'Dr. Lisa Anderson',
      specialty: 'General Physician',
      date: '2024-03-05',
      time: '3:45 PM',
      location: 'Medical Plaza',
      status: 'Completed'
    }
  ];

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate form
    if (!scheduleForm.doctor.trim()) {
      setError('Please enter doctor\'s name');
      return;
    }

    if (!scheduleForm.specialty) {
      setError('Please select a specialty');
      return;
    }

    if (!scheduleForm.date) {
      setError('Please select a date');
      return;
    }

    if (!scheduleForm.time) {
      setError('Please select a time');
      return;
    }

    if (!scheduleForm.location) {
      setError('Please select a location');
      return;
    }

    if (!scheduleForm.reason.trim()) {
      setError('Please enter the reason for visit');
      return;
    }

    // Here you would typically send the appointment data to your backend
    console.log('Scheduling appointment:', scheduleForm);
    
    // Reset form and close modal
    setShowScheduleModal(false);
    setScheduleForm({
      doctor: '',
      specialty: '',
      date: '',
      time: '',
      location: '',
      reason: ''
    });
  };

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!scheduleForm.date) {
      setError('Please select a date');
      return;
    }

    if (!scheduleForm.time) {
      setError('Please select a time');
      return;
    }

    // Here you would typically send the reschedule request to your backend
    console.log('Rescheduling appointment:', {
      appointmentId: selectedAppointment.id,
      newDate: scheduleForm.date,
      newTime: scheduleForm.time
    });

    // Update the appointment in the state
    setUpcomingAppointments(prevAppointments =>
      prevAppointments.map(appointment =>
        appointment.id === selectedAppointment.id
          ? {
              ...appointment,
              date: scheduleForm.date,
              time: scheduleForm.time,
              status: 'Pending'
            }
          : appointment
      )
    );

    // Reset and close
    setShowRescheduleModal(false);
    setSelectedAppointment(null);
    setScheduleForm({
      doctor: '',
      specialty: '',
      date: '',
      time: '',
      location: '',
      reason: ''
    });
  };

  const handleCancelAppointment = () => {
    // Here you would typically send the cancellation request to your backend
    console.log('Cancelling appointment:', selectedAppointment.id);

    // Remove the appointment from the state
    setUpcomingAppointments(prevAppointments =>
      prevAppointments.filter(appointment => appointment.id !== selectedAppointment.id)
    );

    // Close modal and reset
    setShowCancelModal(false);
    setSelectedAppointment(null);
  };

  const handleModalClose = () => {
    setShowScheduleModal(false);
    setShowRescheduleModal(false);
    setShowCancelModal(false);
    setError('');
    setSelectedAppointment(null);
    setScheduleForm({
      doctor: '',
      specialty: '',
      date: '',
      time: '',
      location: '',
      reason: ''
    });
  };

  const handleRescheduleClick = (appointment: any) => {
    setSelectedAppointment(appointment);
    setScheduleForm({
      ...scheduleForm,
      date: appointment.date,
      time: appointment.time
    });
    setShowRescheduleModal(true);
  };

  const handleCancelClick = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Appointments</h1>
        <button 
          onClick={() => setShowScheduleModal(true)}
          className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Schedule New Appointment</span>
        </button>
      </div>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setSelectedTab('upcoming')}
          className={`px-4 py-2 rounded-lg ${
            selectedTab === 'upcoming'
              ? 'bg-teal-500 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Upcoming Appointments
        </button>
        <button
          onClick={() => setSelectedTab('past')}
          className={`px-4 py-2 rounded-lg ${
            selectedTab === 'past'
              ? 'bg-teal-500 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Past Appointments
        </button>
      </div>

      <div className="grid gap-4">
        {(selectedTab === 'upcoming' ? upcomingAppointments : pastAppointments).map((appointment) => (
          <div key={appointment.id} className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold mb-2">{appointment.doctor}</h3>
                <p className="text-gray-400">{appointment.specialty}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  appointment.status === 'Confirmed'
                    ? 'bg-green-500/20 text-green-400'
                    : appointment.status === 'Pending'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-gray-500/20 text-gray-400'
                }`}
              >
                {appointment.status}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 text-gray-300">
                <Calendar className="w-5 h-5" />
                <span>{appointment.date}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Clock className="w-5 h-5" />
                <span>{appointment.time}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <MapPin className="w-5 h-5" />
                <span>{appointment.location}</span>
              </div>
            </div>
            {selectedTab === 'upcoming' && (
              <div className="mt-4 flex space-x-2">
                <button 
                  onClick={() => handleRescheduleClick(appointment)}
                  className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600"
                >
                  Reschedule
                </button>
                <button 
                  onClick={() => handleCancelClick(appointment)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Schedule New Appointment Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Schedule New Appointment</h2>
              <button
                onClick={handleModalClose}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 text-red-400 rounded-lg text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Doctor's Name
                </label>
                <input
                  type="text"
                  value={scheduleForm.doctor}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, doctor: e.target.value })}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter doctor's name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Specialty
                </label>
                <select
                  value={scheduleForm.specialty}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, specialty: e.target.value })}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select a specialty</option>
                  {specialties.map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={scheduleForm.date}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  value={scheduleForm.time}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  min="09:00"
                  max="17:00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Location
                </label>
                <select
                  value={scheduleForm.location}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, location: e.target.value })}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select a location</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Reason for Visit
                </label>
                <textarea
                  value={scheduleForm.reason}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, reason: e.target.value })}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  rows={3}
                  placeholder="Describe the reason for your visit"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-4 py-2 text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600"
                >
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Reschedule Appointment</h2>
              <button
                onClick={handleModalClose}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 text-red-400 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div className="mb-6">
              <p className="text-gray-300 mb-2">Current Appointment:</p>
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <p className="text-white font-medium">{selectedAppointment.doctor}</p>
                <p className="text-gray-400">{selectedAppointment.specialty}</p>
                <p className="text-gray-300 mt-2">
                  {selectedAppointment.date} at {selectedAppointment.time}
                </p>
                <p className="text-gray-300">{selectedAppointment.location}</p>
              </div>
            </div>
            <form onSubmit={handleRescheduleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  New Date
                </label>
                <input
                  type="date"
                  value={scheduleForm.date}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  New Time
                </label>
                <input
                  type="time"
                  value={scheduleForm.time}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  min="09:00"
                  max="17:00"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-4 py-2 text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600"
                >
                  Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Appointment Modal */}
      {showCancelModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Cancel Appointment</h2>
              <button
                onClick={handleModalClose}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="mb-6">
              <div className="flex items-center space-x-2 text-yellow-400 mb-4">
                <AlertTriangle className="w-5 h-5" />
                <p className="font-medium">Are you sure you want to cancel this appointment?</p>
              </div>
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <p className="text-white font-medium">{selectedAppointment.doctor}</p>
                <p className="text-gray-400">{selectedAppointment.specialty}</p>
                <p className="text-gray-300 mt-2">
                  {selectedAppointment.date} at {selectedAppointment.time}
                </p>
                <p className="text-gray-300">{selectedAppointment.location}</p>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleModalClose}
                className="px-4 py-2 text-gray-300 hover:text-white"
              >
                No, Keep Appointment
              </button>
              <button
                onClick={handleCancelAppointment}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
              >
                Yes, Cancel Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Appointments;