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
  ArrowLeft,
  Save,
  X
} from 'lucide-react';
import { Patient, HealthRecord, BloodPressureData, SugarLevelData, BabyMovementData } from '../types';

interface PatientDashboardProps {
  patient: Patient;
}

const PatientDashboard: React.FC<PatientDashboardProps> = ({ patient }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Mock health records for demonstration
  const mockHealthRecords: HealthRecord[] = [
    {
      id: 'mock-1',
      patientId: patient.id,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      type: 'blood_pressure',
      data: {
        systolic: 118,
        diastolic: 78,
        heartRate: 72,
        notes: 'Morning reading after breakfast'
      }
    },
    {
      id: 'mock-2',
      patientId: patient.id,
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      type: 'sugar_level',
      data: {
        level: 95,
        testType: 'fasting',
        notes: 'Fasting reading before breakfast'
      }
    },
    {
      id: 'mock-3',
      patientId: patient.id,
      date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
      type: 'baby_movement',
      data: {
        count: 12,
        duration: 45,
        notes: 'Very active after lunch, strong kicks'
      }
    },
    {
      id: 'mock-4',
      patientId: patient.id,
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
      type: 'blood_pressure',
      data: {
        systolic: 122,
        diastolic: 82,
        heartRate: 75,
        notes: 'Evening reading, felt a bit tired'
      }
    },
    {
      id: 'mock-5',
      patientId: patient.id,
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      type: 'sugar_level',
      data: {
        level: 140,
        testType: 'post_meal',
        notes: '2 hours after dinner'
      }
    },
    {
      id: 'mock-6',
      patientId: patient.id,
      date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      type: 'baby_movement',
      data: {
        count: 8,
        duration: 30,
        notes: 'Gentle movements during rest time'
      }
    },
    {
      id: 'mock-7',
      patientId: patient.id,
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
      type: 'blood_pressure',
      data: {
        systolic: 115,
        diastolic: 75,
        heartRate: 68,
        notes: 'Good reading after morning walk'
      }
    },
    {
      id: 'mock-8',
      patientId: patient.id,
      date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
      type: 'sugar_level',
      data: {
        level: 88,
        testType: 'random',
        notes: 'Mid-afternoon check'
      }
    }
  ];

  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([
    ...mockHealthRecords,
    ...(patient.healthRecords || [])
  ]);
  // Form states
  const [bloodPressureForm, setBloodPressureForm] = useState({
    systolic: '',
    diastolic: '',
    heartRate: '',
    notes: ''
  });

  const [sugarLevelForm, setSugarLevelForm] = useState({
    level: '',
    testType: 'fasting' as 'fasting' | 'random' | 'post_meal',
    notes: ''
  });

  const [babyMovementForm, setBabyMovementForm] = useState({
    count: '',
    duration: '',
    notes: ''
  });

  const [nutritionForm, setNutritionForm] = useState({
    meal: '',
    foods: '',
    calories: '',
    notes: ''
  });

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

  const addHealthRecord = (type: string, data: any) => {
    const newRecord: HealthRecord = {
      id: Date.now().toString(),
      patientId: patient.id,
      date: new Date().toISOString(),
      type: type as any,
      data
    };

    const updatedRecords = [newRecord, ...healthRecords];
    setHealthRecords(updatedRecords);
    
    // Save only user-added records (not mock data) to localStorage
    const userRecords = updatedRecords.filter(record => !record.id.startsWith('mock-'));
    const updatedPatient = { ...patient, healthRecords: userRecords };
    localStorage.setItem('user', JSON.stringify(updatedPatient));
    
    // Update registered users as well
    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const userIndex = existingUsers.findIndex((u: any) => u.id === patient.id);
    if (userIndex !== -1) {
      existingUsers[userIndex] = { ...existingUsers[userIndex], healthRecords: userRecords };
      localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
    }
    
    setShowAddForm(false);
    resetForms();
  };

  const resetForms = () => {
    setBloodPressureForm({ systolic: '', diastolic: '', heartRate: '', notes: '' });
    setSugarLevelForm({ level: '', testType: 'fasting', notes: '' });
    setBabyMovementForm({ count: '', duration: '', notes: '' });
    setNutritionForm({ meal: '', foods: '', calories: '', notes: '' });
  };

  const getRecordsByType = (type: string) => {
    return healthRecords.filter(record => record.type === type);
  };

  const getLatestRecord = (type: string) => {
    const records = getRecordsByType(type);
    return records.length > 0 ? records[0] : null;
  };

  const getAverageBloodPressure = () => {
    const records = getRecordsByType('blood_pressure');
    if (records.length === 0) return null;
    
    const total = records.reduce((acc, record) => ({
      systolic: acc.systolic + record.data.systolic,
      diastolic: acc.diastolic + record.data.diastolic,
      heartRate: acc.heartRate + (record.data.heartRate || 0)
    }), { systolic: 0, diastolic: 0, heartRate: 0 });
    
    return {
      systolic: Math.round(total.systolic / records.length),
      diastolic: Math.round(total.diastolic / records.length),
      heartRate: Math.round(total.heartRate / records.length)
    };
  };

  const getAverageSugarLevel = () => {
    const records = getRecordsByType('sugar_level');
    if (records.length === 0) return null;
    
    const total = records.reduce((acc, record) => acc + record.data.level, 0);
    return Math.round(total / records.length);
  };

  const getAverageBabyMovement = () => {
    const records = getRecordsByType('baby_movement');
    if (records.length === 0) return null;
    
    const total = records.reduce((acc, record) => ({
      count: acc.count + record.data.count,
      duration: acc.duration + (record.data.duration || 0)
    }), { count: 0, duration: 0 });
    
    return {
      count: Math.round(total.count / records.length),
      duration: Math.round(total.duration / records.length)
    };
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Pregnancy Progress */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">Pregnancy Progress</h3>
            <p className="text-pink-100">Week {patient.currentWeek || 0} of 40</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{patient.currentWeek || 0}/40</p>
            <p className="text-pink-100">weeks</p>
          </div>
        </div>
        <div className="mt-4 bg-white bg-opacity-20 rounded-full h-2">
          <div 
            className="bg-white rounded-full h-2 transition-all duration-500"
            style={{ width: `${((patient.currentWeek || 0) / 40) * 100}%` }}
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

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        {healthRecords.length > 0 ? (
          <div className="space-y-3">
            {healthRecords.slice(0, 5).map((record) => (
              <div key={record.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium capitalize">{record.type.replace('_', ' ')}</p>
                  <p className="text-xs text-gray-500">{formatDate(record.date)}</p>
                </div>
                <div className="text-right">
                  {record.type === 'blood_pressure' && (
                    <p className="text-xs font-medium text-gray-700">
                      {record.data.systolic}/{record.data.diastolic}
                    </p>
                  )}
                  {record.type === 'sugar_level' && (
                    <p className="text-xs font-medium text-gray-700">
                      {record.data.level} mg/dL
                    </p>
                  )}
                  {record.type === 'baby_movement' && (
                    <p className="text-xs font-medium text-gray-700">
                      {record.data.count} moves
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No activity yet. Start tracking your health!</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderBloodPressureForm = () => (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h4 className="text-lg font-semibold mb-4">Add Blood Pressure Reading</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Systolic (mmHg)</label>
          <input
            type="number"
            value={bloodPressureForm.systolic}
            onChange={(e) => setBloodPressureForm({...bloodPressureForm, systolic: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="120"
            min="60"
            max="250"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Diastolic (mmHg)</label>
          <input
            type="number"
            value={bloodPressureForm.diastolic}
            onChange={(e) => setBloodPressureForm({...bloodPressureForm, diastolic: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="80"
            min="40"
            max="150"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Heart Rate (bpm)</label>
          <input
            type="number"
            value={bloodPressureForm.heartRate}
            onChange={(e) => setBloodPressureForm({...bloodPressureForm, heartRate: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="72"
            min="40"
            max="200"
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Notes (optional)</label>
        <textarea
          value={bloodPressureForm.notes}
          onChange={(e) => setBloodPressureForm({...bloodPressureForm, notes: e.target.value})}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          rows={3}
          placeholder="Any additional notes..."
        />
      </div>
      <div className="flex space-x-3">
        <button
          onClick={() => {
            const systolic = parseInt(bloodPressureForm.systolic);
            const diastolic = parseInt(bloodPressureForm.diastolic);
            const heartRate = bloodPressureForm.heartRate ? parseInt(bloodPressureForm.heartRate) : 0;
            
            if (systolic && diastolic && systolic > 0 && diastolic > 0) {
              addHealthRecord('blood_pressure', {
                systolic,
                diastolic,
                heartRate,
                notes: bloodPressureForm.notes
              });
            } else {
              alert('Please enter valid systolic and diastolic values');
            }
          }}
          disabled={!bloodPressureForm.systolic || !bloodPressureForm.diastolic}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Reading</span>
        </button>
        <button
          onClick={() => setShowAddForm(false)}
          className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <X className="w-4 h-4" />
          <span>Cancel</span>
        </button>
      </div>
    </div>
  );

  const renderBloodPressure = () => {
    const records = getRecordsByType('blood_pressure');
    const latestRecord = getLatestRecord('blood_pressure');
    const averageData = getAverageBloodPressure();
    
    return (
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
            <button 
              onClick={() => setShowAddForm(true)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Reading</span>
            </button>
          </div>
        </div>
        
        {showAddForm && renderBloodPressureForm()}
        
        {/* Statistics Cards */}
        {records.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-red-50 rounded-lg p-4 border border-red-100">
              <h4 className="font-medium text-red-800 mb-2">Latest Reading</h4>
              {latestRecord && (
                <div>
                  <p className="text-lg font-bold text-red-700">
                    {latestRecord.data.systolic}/{latestRecord.data.diastolic} mmHg
                  </p>
                  {latestRecord.data.heartRate > 0 && (
                    <p className="text-sm text-red-600">HR: {latestRecord.data.heartRate} bpm</p>
                  )}
                  <p className="text-xs text-red-500 mt-1">{formatDate(latestRecord.date)}</p>
                </div>
              )}
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <h4 className="font-medium text-blue-800 mb-2">Average ({records.length} readings)</h4>
              {averageData && (
                <div>
                  <p className="text-lg font-bold text-blue-700">
                    {averageData.systolic}/{averageData.diastolic} mmHg
                  </p>
                  {averageData.heartRate > 0 && (
                    <p className="text-sm text-blue-600">Avg HR: {averageData.heartRate} bpm</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="mt-6">
          {records.length > 0 ? (
            <div className="space-y-4">
              {records.map((record) => (
                <div key={record.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-800">
                        {record.data.systolic}/{record.data.diastolic} mmHg
                      </p>
                      {record.data.heartRate > 0 && (
                        <p className="text-sm text-gray-600">Heart Rate: {record.data.heartRate} bpm</p>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">{formatDate(record.date)}</span>
                  </div>
                  {record.data.notes && (
                    <p className="text-sm text-gray-600 mt-2">{record.data.notes}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-600 mb-2">No readings yet</h4>
              <p className="text-gray-500 mb-6">Start tracking your blood pressure by adding your first reading</p>
              <button 
                onClick={() => setShowAddForm(true)}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium"
              >
                Add First Reading
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSugarLevelForm = () => (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h4 className="text-lg font-semibold mb-4">Add Sugar Level Reading</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sugar Level (mg/dL)</label>
          <input
            type="number"
            value={sugarLevelForm.level}
            onChange={(e) => setSugarLevelForm({...sugarLevelForm, level: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="100"
            min="50"
            max="400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Test Type</label>
          <select
            value={sugarLevelForm.testType}
            onChange={(e) => setSugarLevelForm({...sugarLevelForm, testType: e.target.value as any})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="fasting">Fasting</option>
            <option value="random">Random</option>
            <option value="post_meal">Post Meal</option>
          </select>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Notes (optional)</label>
        <textarea
          value={sugarLevelForm.notes}
          onChange={(e) => setSugarLevelForm({...sugarLevelForm, notes: e.target.value})}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
          placeholder="Any additional notes..."
        />
      </div>
      <div className="flex space-x-3">
        <button
          onClick={() => {
            const level = parseInt(sugarLevelForm.level);
            
            if (level && level > 0) {
              addHealthRecord('sugar_level', {
                level,
                testType: sugarLevelForm.testType,
                notes: sugarLevelForm.notes
              });
            } else {
              alert('Please enter a valid sugar level');
            }
          }}
          disabled={!sugarLevelForm.level}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Reading</span>
        </button>
        <button
          onClick={() => setShowAddForm(false)}
          className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <X className="w-4 h-4" />
          <span>Cancel</span>
        </button>
      </div>
    </div>
  );

  const renderSugarLevel = () => {
    const records = getRecordsByType('sugar_level');
    const latestRecord = getLatestRecord('sugar_level');
    const averageLevel = getAverageSugarLevel();
    
    return (
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
            <button 
              onClick={() => setShowAddForm(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Reading</span>
            </button>
          </div>
        </div>
        
        {showAddForm && renderSugarLevelForm()}
        
        {/* Statistics Cards */}
        {records.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <h4 className="font-medium text-blue-800 mb-2">Latest Reading</h4>
              {latestRecord && (
                <div>
                  <p className="text-lg font-bold text-blue-700">{latestRecord.data.level} mg/dL</p>
                  <p className="text-sm text-blue-600 capitalize">{latestRecord.data.testType.replace('_', ' ')}</p>
                  <p className="text-xs text-blue-500 mt-1">{formatDate(latestRecord.date)}</p>
                </div>
              )}
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <h4 className="font-medium text-green-800 mb-2">Average ({records.length} readings)</h4>
              {averageLevel && (
                <div>
                  <p className="text-lg font-bold text-green-700">{averageLevel} mg/dL</p>
                  <p className="text-sm text-green-600">All test types</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="mt-6">
          {records.length > 0 ? (
            <div className="space-y-4">
              {records.map((record) => (
                <div key={record.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-800">{record.data.level} mg/dL</p>
                      <p className="text-sm text-gray-600 capitalize">{record.data.testType.replace('_', ' ')}</p>
                    </div>
                    <span className="text-xs text-gray-500">{formatDate(record.date)}</span>
                  </div>
                  {record.data.notes && (
                    <p className="text-sm text-gray-600 mt-2">{record.data.notes}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Droplets className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-600 mb-2">No readings yet</h4>
              <p className="text-gray-500 mb-6">Start monitoring your sugar levels by adding your first reading</p>
              <button 
                onClick={() => setShowAddForm(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
              >
                Add First Reading
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderBabyMovementForm = () => (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h4 className="text-lg font-semibold mb-4">Log Baby Movement</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Movement Count</label>
          <input
            type="number"
            value={babyMovementForm.count}
            onChange={(e) => setBabyMovementForm({...babyMovementForm, count: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="10"
            min="1"
            max="100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
          <input
            type="number"
            value={babyMovementForm.duration}
            onChange={(e) => setBabyMovementForm({...babyMovementForm, duration: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="30"
            min="1"
            max="300"
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Notes (optional)</label>
        <textarea
          value={babyMovementForm.notes}
          onChange={(e) => setBabyMovementForm({...babyMovementForm, notes: e.target.value})}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          rows={3}
          placeholder="Describe the movements..."
        />
      </div>
      <div className="flex space-x-3">
        <button
          onClick={() => {
            const count = parseInt(babyMovementForm.count);
            const duration = babyMovementForm.duration ? parseInt(babyMovementForm.duration) : 0;
            
            if (count && count > 0) {
              addHealthRecord('baby_movement', {
                count,
                duration,
                notes: babyMovementForm.notes
              });
            } else {
              alert('Please enter a valid movement count');
            }
          }}
          disabled={!babyMovementForm.count}
          className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Movement</span>
        </button>
        <button
          onClick={() => setShowAddForm(false)}
          className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <X className="w-4 h-4" />
          <span>Cancel</span>
        </button>
      </div>
    </div>
  );

  const renderBabyMovement = () => {
    const records = getRecordsByType('baby_movement');
    const latestRecord = getLatestRecord('baby_movement');
    const averageData = getAverageBabyMovement();
    
    return (
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
            <button 
              onClick={() => setShowAddForm(true)}
              className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Log Movement</span>
            </button>
          </div>
        </div>
        
        {showAddForm && renderBabyMovementForm()}
        
        {/* Statistics Cards */}
        {records.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-pink-50 rounded-lg p-4 border border-pink-100">
              <h4 className="font-medium text-pink-800 mb-2">Latest Activity</h4>
              {latestRecord && (
                <div>
                  <p className="text-lg font-bold text-pink-700">{latestRecord.data.count} movements</p>
                  {latestRecord.data.duration > 0 && (
                    <p className="text-sm text-pink-600">{latestRecord.data.duration} minutes</p>
                  )}
                  <p className="text-xs text-pink-500 mt-1">{formatDate(latestRecord.date)}</p>
                </div>
              )}
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
              <h4 className="font-medium text-purple-800 mb-2">Average ({records.length} sessions)</h4>
              {averageData && (
                <div>
                  <p className="text-lg font-bold text-purple-700">{averageData.count} movements</p>
                  {averageData.duration > 0 && (
                    <p className="text-sm text-purple-600">Avg: {averageData.duration} min</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="mt-6">
          {records.length > 0 ? (
            <div className="space-y-4">
              {records.map((record) => (
                <div key={record.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-800">{record.data.count} movements</p>
                      {record.data.duration > 0 && (
                        <p className="text-sm text-gray-600">Duration: {record.data.duration} minutes</p>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">{formatDate(record.date)}</span>
                  </div>
                  {record.data.notes && (
                    <p className="text-sm text-gray-600 mt-2">{record.data.notes}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Baby className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-600 mb-2">No movements logged yet</h4>
              <p className="text-gray-500 mb-6">Start tracking your baby's movements to monitor their activity</p>
              <button 
                onClick={() => setShowAddForm(true)}
                className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-medium"
              >
                Log First Movement
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

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
        <button 
          onClick={() => setActiveTab('overview')}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
          <h5 className="font-medium text-gray-800 mb-2">Week {patient.currentWeek || 0} Recommendations</h5>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Increase iron-rich foods (spinach, lean meat)</li>
            <li>• 3-4 servings of dairy products daily</li>
            <li>• Include omega-3 fatty acids (fish, walnuts)</li>
            <li>• Stay hydrated with 8-10 glasses of water</li>
          </ul>
        </div>

        <div className="text-center py-8">
          <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-600 mb-2">Nutrition tracking coming soon</h4>
          <p className="text-gray-500 mb-6">Follow the weekly recommendations above for now</p>
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
        <button 
          onClick={() => setActiveTab('overview')}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
        </button>
      </div>
      
      <div className="text-center py-12">
        <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h4 className="text-lg font-medium text-gray-600 mb-2">Doctor messaging coming soon</h4>
        <p className="text-gray-500 mb-6">Connect with your healthcare provider for guidance and support</p>
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
        <button 
          onClick={() => setActiveTab('overview')}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
        </button>
      </div>
      
      <div className="space-y-6">
        <div className="bg-indigo-50 rounded-lg p-4">
          <h4 className="font-medium text-indigo-800 mb-2">Week {patient.currentWeek || 0} Health Check</h4>
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
          
          <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-lg font-medium">
            Submit Health Update
          </button>
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
        <button 
          onClick={() => setActiveTab('overview')}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
        </button>
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
            <p className="text-gray-500 mb-6">Emergency contacts were not set up during profile completion</p>
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
    // Reset form when switching tabs
    if (showAddForm) {
      setShowAddForm(false);
    }

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