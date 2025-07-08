import React, { useState } from 'react';
import { 
  Activity, 
  Droplets, 
  Baby, 
  ChefHat, 
  Phone, 
  MessageCircle, 
  FileText, 
  AlertTriangle,
  Calendar,
  TrendingUp,
  Heart,
  Plus,
  Home,
  ArrowLeft
} from 'lucide-react';
import { Patient } from '../types';

interface PatientDashboardProps {
  patient: Patient;
}

const PatientDashboard: React.FC<PatientDashboardProps> = ({ patient }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const features = [
    {
      id: 'blood-pressure',
      title: 'Blood Pressure',
      icon: Activity,
      color: 'bg-red-500',
      description: 'Track your blood pressure readings'
    },
    {
      id: 'sugar-level',
      title: 'Sugar Level',
      icon: Droplets,
      color: 'bg-blue-500',
      description: 'Monitor your glucose levels'
    },
    {
      id: 'baby-movement',
      title: 'Baby Movement',
      icon: Baby,
      color: 'bg-pink-500',
      description: 'Record your baby\'s movements'
    },
    {
      id: 'nutrition',
      title: 'Nutrition Chart',
      icon: ChefHat,
      color: 'bg-green-500',
      description: 'Weekly nutritional guidance'
    },
    {
      id: 'emergency',
      title: 'Emergency Contacts',
      icon: Phone,
      color: 'bg-orange-500',
      description: 'Quick access to emergency contacts'
    },
    {
      id: 'doctor-chat',
      title: 'Doctor Connect',
      icon: MessageCircle,
      color: 'bg-purple-500',
      description: 'Chat with your doctor'
    },
    {
      id: 'health-update',
      title: 'Health Update',
      icon: FileText,
      color: 'bg-indigo-500',
      description: 'Submit weekly health updates'
    },
    {
      id: 'sos',
      title: 'SOS Emergency',
      icon: AlertTriangle,
      color: 'bg-red-600',
      description: 'Emergency alert button'
    }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Pregnancy Progress */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">Pregnancy Progress</h3>
            <p className="text-pink-100">Week {patient.currentWeek} of 40</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{patient.currentWeek}/40</p>
            <p className="text-pink-100">weeks</p>
          </div>
        </div>
        <div className="mt-4 bg-white bg-opacity-20 rounded-full h-2">
          <div 
            className="bg-white rounded-full h-2 transition-all duration-500"
            style={{ width: `${(patient.currentWeek / 40) * 100}%` }}
          />
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
            onClick={() => setActiveTab(feature.id)}
          >
            <div className={`w-10 h-10 ${feature.color} rounded-lg flex items-center justify-center mb-3`}>
              <feature.icon className="w-5 h-5 text-white" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-1">{feature.title}</h4>
            <p className="text-sm text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Getting Started */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Getting Started</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <Activity className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm font-medium">Start tracking your health</p>
              <p className="text-xs text-gray-500">Begin by recording your first blood pressure reading</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <ChefHat className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-sm font-medium">Plan your nutrition</p>
              <p className="text-xs text-gray-500">Check out the nutrition chart for healthy meal ideas</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
            <MessageCircle className="w-5 h-5 text-purple-500" />
            <div>
              <p className="text-sm font-medium">Connect with your doctor</p>
              <p className="text-xs text-gray-500">Send messages and receive guidance from healthcare professionals</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBloodPressure = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setActiveTab('overview')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h3 className="text-lg font-semibold">Blood Pressure Tracker</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Reading</span>
          </button>
        </div>
      </div>
      
      <div className="text-center py-12">
        <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h4 className="text-lg font-medium text-gray-600 mb-2">No readings yet</h4>
        <p className="text-gray-500 mb-6">Start tracking your blood pressure by adding your first reading</p>
        <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium">
          Add First Reading
        </button>
      </div>
    </div>
  );

  const renderSugarLevel = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setActiveTab('overview')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h3 className="text-lg font-semibold">Sugar Level Tracker</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Reading</span>
          </button>
        </div>
      </div>
      
      <div className="text-center py-12">
        <Droplets className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h4 className="text-lg font-medium text-gray-600 mb-2">No readings yet</h4>
        <p className="text-gray-500 mb-6">Start monitoring your sugar levels by adding your first reading</p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium">
          Add First Reading
        </button>
      </div>
    </div>
  );

  const renderBabyMovement = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setActiveTab('overview')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h3 className="text-lg font-semibold">Baby Movement Tracker</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <button className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Log Movement</span>
          </button>
        </div>
      </div>
      
      <div className="text-center py-12">
        <Baby className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h4 className="text-lg font-medium text-gray-600 mb-2">No movements logged yet</h4>
        <p className="text-gray-500 mb-6">Start tracking your baby's movements to monitor their activity</p>
        <button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-medium">
          Log First Movement
        </button>
      </div>
    </div>
  );

  const renderNutrition = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setActiveTab('overview')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h3 className="text-lg font-semibold">Nutrition Chart</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Log Meal</span>
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
          <h5 className="font-medium text-gray-800 mb-2">Week {patient.currentWeek} Recommendations</h5>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Increase iron-rich foods (spinach, lean meat)</li>
            <li>• 3-4 servings of dairy products daily</li>
            <li>• Include omega-3 fatty acids (fish, walnuts)</li>
            <li>• Stay hydrated with 8-10 glasses of water</li>
          </ul>
        </div>

        <div className="text-center py-8">
          <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-600 mb-2">Start tracking your nutrition</h4>
          <p className="text-gray-500 mb-6">Log your meals to ensure you're getting proper nutrition</p>
          <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium">
            Log First Meal
          </button>
        </div>
      </div>
    </div>
  );

  const renderDoctorChat = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setActiveTab('overview')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h3 className="text-lg font-semibold">Doctor Connect</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
            <MessageCircle className="w-4 h-4" />
            <span>New Message</span>
          </button>
        </div>
      </div>
      
      <div className="text-center py-12">
        <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h4 className="text-lg font-medium text-gray-600 mb-2">No messages yet</h4>
        <p className="text-gray-500 mb-6">Connect with your healthcare provider for guidance and support</p>
        <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium">
          Send First Message
        </button>
      </div>
    </div>
  );

  const renderHealthUpdate = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setActiveTab('overview')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h3 className="text-lg font-semibold">Health Update</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Submit Update</span>
          </button>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="bg-indigo-50 rounded-lg p-4">
          <h4 className="font-medium text-indigo-800 mb-2">Week {patient.currentWeek} Health Check</h4>
          <p className="text-sm text-indigo-600">Please complete your weekly health update to keep your doctor informed.</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Weight (kg)</label>
            <input type="number" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Enter your weight" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Symptoms (if any)</label>
            <textarea className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" rows={3} placeholder="Describe any symptoms you're experiencing"></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Overall Mood (1-10)</label>
            <input type="range" min="1" max="10" className="w-full" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSOS = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setActiveTab('overview')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h3 className="text-lg font-semibold">SOS Emergency</h3>
        </div>
        <button 
          onClick={() => setActiveTab('overview')}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
        </button>
      </div>
      
      <div className="text-center space-y-6">
        <div className="bg-red-50 rounded-xl p-8">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h4 className="text-xl font-bold text-red-700 mb-2">Emergency Alert</h4>
          <p className="text-red-600 mb-6">Press the button below if you need immediate medical assistance</p>
          
          <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transform hover:scale-105 transition-all">
            EMERGENCY CALL
          </button>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-4">
          <h5 className="font-medium text-orange-800 mb-2">Quick Actions</h5>
          <div className="space-y-2">
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg">Call Doctor</button>
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg">Call Emergency Contact</button>
            <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg">Send Location to Family</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmergencyContacts = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setActiveTab('overview')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h3 className="text-lg font-semibold">Emergency Contacts</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Contact</span>
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {patient.emergencyContacts && patient.emergencyContacts.length > 0 ? (
          <>
            {patient.emergencyContacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="font-medium text-gray-800">{contact.name}</p>
                    <p className="text-sm text-gray-600">{contact.relationship}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">{contact.phone}</p>
                  <button className="text-xs text-orange-600 hover:text-orange-800">Call now</button>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="text-center py-8">
            <Phone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-600 mb-2">No emergency contacts</h4>
            <p className="text-gray-500 mb-6">Add emergency contacts for quick access during emergencies</p>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium">
              Add First Contact
            </button>
          </div>
        )}
        
        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <div>
              <p className="font-medium text-red-700">Emergency Services</p>
              <p className="text-sm text-red-600">24/7 Emergency Line</p>
            </div>
          </div>
          <button className="mt-2 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium">
            Call 911
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'blood-pressure':
        return renderBloodPressure();
      case 'sugar-level':
        return renderSugarLevel();
      case 'baby-movement':
        return renderBabyMovement();
      case 'nutrition':
        return renderNutrition();
      case 'doctor-chat':
        return renderDoctorChat();
      case 'health-update':
        return renderHealthUpdate();
      case 'sos':
        return renderSOS();
      case 'emergency':
        return renderEmergencyContacts();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome back, {patient.name}
          </h1>
          <p className="text-gray-600">
            Track your pregnancy journey and stay connected with your healthcare team
          </p>
        </div>

        {renderContent()}
      </div>
    </div>
  );
};

export default PatientDashboard;