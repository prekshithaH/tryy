import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Activity, 
  Calendar, 
  TrendingUp, 
  Baby, 
  Phone, 
  MessageSquare,
  Plus,
  Edit3,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Clock,
  Weight,
  Droplets,
  Zap
} from 'lucide-react';
import { Patient, HealthRecord, BloodPressureData, SugarLevelData, BabyMovementData, WeeklyUpdateData } from '../types';

interface PatientDashboardProps {
  patient: Patient;
}

const PatientDashboard: React.FC<PatientDashboardProps> = ({ patient }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [recordType, setRecordType] = useState<'blood_pressure' | 'sugar_level' | 'baby_movement' | 'weekly_update'>('blood_pressure');
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>(patient.healthRecords || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states for different record types
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

  const [weeklyUpdateForm, setWeeklyUpdateForm] = useState({
    weight: '',
    symptoms: [] as string[],
    mood: 5,
    notes: ''
  });

  // Load health records from localStorage on component mount
  useEffect(() => {
    const storedRecords = localStorage.getItem(`healthRecords_${patient.id}`);
    if (storedRecords) {
      setHealthRecords(JSON.parse(storedRecords));
    }
  }, [patient.id]);

  // Save health records to localStorage and notify doctor
  const saveHealthRecords = (records: HealthRecord[]) => {
    localStorage.setItem(`healthRecords_${patient.id}`, JSON.stringify(records));
    
    // Update patient's health records in user data
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (currentUser.id === patient.id) {
      currentUser.healthRecords = records;
      localStorage.setItem('user', JSON.stringify(currentUser));
    }

    // Update in registered users
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const userIndex = registeredUsers.findIndex((u: any) => u.id === patient.id);
    if (userIndex !== -1) {
      registeredUsers[userIndex].healthRecords = records;
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    }

    // Create notification for Dr. Rajesh
    const notifications = JSON.parse(localStorage.getItem('doctorNotifications') || '[]');
    const newNotification = {
      id: Date.now().toString(),
      patientId: patient.id,
      patientName: patient.name,
      message: `New health record added`,
      type: 'health_update',
      timestamp: new Date().toISOString(),
      read: false
    };
    notifications.push(newNotification);
    localStorage.setItem('doctorNotifications', JSON.stringify(notifications));
  };

  const handleSubmitRecord = async () => {
    setIsSubmitting(true);
    
    let recordData: any;
    
    switch (recordType) {
      case 'blood_pressure':
        recordData = {
          systolic: parseInt(bloodPressureForm.systolic),
          diastolic: parseInt(bloodPressureForm.diastolic),
          heartRate: parseInt(bloodPressureForm.heartRate),
          notes: bloodPressureForm.notes
        };
        break;
      case 'sugar_level':
        recordData = {
          level: parseFloat(sugarLevelForm.level),
          testType: sugarLevelForm.testType,
          notes: sugarLevelForm.notes
        };
        break;
      case 'baby_movement':
        recordData = {
          count: parseInt(babyMovementForm.count),
          duration: parseInt(babyMovementForm.duration),
          notes: babyMovementForm.notes
        };
        break;
      case 'weekly_update':
        recordData = {
          weight: parseFloat(weeklyUpdateForm.weight),
          symptoms: weeklyUpdateForm.symptoms,
          mood: weeklyUpdateForm.mood,
          notes: weeklyUpdateForm.notes
        };
        break;
    }

    const newRecord: HealthRecord = {
      id: Date.now().toString(),
      patientId: patient.id,
      date: new Date().toISOString(),
      type: recordType,
      data: recordData
    };

    const updatedRecords = [...healthRecords, newRecord];
    setHealthRecords(updatedRecords);
    saveHealthRecords(updatedRecords);

    // Reset forms
    setBloodPressureForm({ systolic: '', diastolic: '', heartRate: '', notes: '' });
    setSugarLevelForm({ level: '', testType: 'fasting', notes: '' });
    setBabyMovementForm({ count: '', duration: '', notes: '' });
    setWeeklyUpdateForm({ weight: '', symptoms: [], mood: 5, notes: '' });
    
    setShowAddRecord(false);
    setIsSubmitting(false);
  };

  const calculateWeeksRemaining = () => {
    if (!patient.dueDate) return 0;
    const due = new Date(patient.dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    return Math.max(0, diffWeeks);
  };

  const getLatestRecord = (type: string) => {
    return healthRecords
      .filter(record => record.type === type)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  };

  const renderOverview = () => {
    const weeksRemaining = calculateWeeksRemaining();
    const latestBP = getLatestRecord('blood_pressure');
    const latestSugar = getLatestRecord('sugar_level');
    const latestMovement = getLatestRecord('baby_movement');

    return (
      <div className="space-y-6">
        {/* Pregnancy Progress */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold">Week {patient.currentWeek || 0}</h3>
              <p className="text-pink-100">of your pregnancy journey</p>
            </div>
            <Baby className="w-12 h-12 text-pink-200" />
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span>{patient.currentWeek || 0}/40 weeks</span>
            </div>
            <div className="w-full bg-pink-400 rounded-full h-3">
              <div 
                className="bg-white h-3 rounded-full transition-all duration-300"
                style={{ width: `${((patient.currentWeek || 0) / 40) * 100}%` }}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-pink-200">Due Date</p>
              <p className="font-semibold">{patient.dueDate || 'Not set'}</p>
            </div>
            <div>
              <p className="text-pink-200">Weeks Remaining</p>
              <p className="font-semibold">{weeksRemaining} weeks</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-red-600" />
              </div>
              <span className="text-xs text-gray-500">Latest</span>
            </div>
            <h4 className="font-semibold text-gray-800 mb-1">Blood Pressure</h4>
            {latestBP ? (
              <p className="text-lg font-bold text-gray-900">
                {latestBP.data.systolic}/{latestBP.data.diastolic}
              </p>
            ) : (
              <p className="text-sm text-gray-500">No records yet</p>
            )}
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Droplets className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xs text-gray-500">Latest</span>
            </div>
            <h4 className="font-semibold text-gray-800 mb-1">Sugar Level</h4>
            {latestSugar ? (
              <p className="text-lg font-bold text-gray-900">
                {latestSugar.data.level} mg/dL
              </p>
            ) : (
              <p className="text-sm text-gray-500">No records yet</p>
            )}
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-xs text-gray-500">Latest</span>
            </div>
            <h4 className="font-semibold text-gray-800 mb-1">Baby Movements</h4>
            {latestMovement ? (
              <p className="text-lg font-bold text-gray-900">
                {latestMovement.data.count} kicks
              </p>
            ) : (
              <p className="text-sm text-gray-500">No records yet</p>
            )}
          </div>
        </div>

        {/* Doctor Information */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Healthcare Team</h3>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              DR
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">Dr. Rajesh</p>
              <p className="text-sm text-gray-600">Obstetrician & Gynecologist</p>
              <p className="text-xs text-gray-500">Your assigned doctor</p>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors">
                <Phone className="w-4 h-4 text-blue-600" />
              </button>
              <button className="p-2 bg-green-100 hover:bg-green-200 rounded-lg transition-colors">
                <MessageSquare className="w-4 h-4 text-green-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Recent Records */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Recent Health Records</h3>
            <button
              onClick={() => setActiveTab('records')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View all
            </button>
          </div>
          
          {healthRecords.length > 0 ? (
            <div className="space-y-3">
              {healthRecords
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 3)
                .map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        record.type === 'blood_pressure' ? 'bg-red-100' :
                        record.type === 'sugar_level' ? 'bg-blue-100' :
                        record.type === 'baby_movement' ? 'bg-green-100' :
                        'bg-purple-100'
                      }`}>
                        {record.type === 'blood_pressure' && <Activity className="w-4 h-4 text-red-600" />}
                        {record.type === 'sugar_level' && <Droplets className="w-4 h-4 text-blue-600" />}
                        {record.type === 'baby_movement' && <Zap className="w-4 h-4 text-green-600" />}
                        {record.type === 'weekly_update' && <Weight className="w-4 h-4 text-purple-600" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 capitalize">
                          {record.type.replace('_', ' ')}
                        </p>
                        <p className="text-xs text-gray-600">
                          {new Date(record.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-800">
                        {record.type === 'blood_pressure' && `${record.data.systolic}/${record.data.diastolic}`}
                        {record.type === 'sugar_level' && `${record.data.level} mg/dL`}
                        {record.type === 'baby_movement' && `${record.data.count} kicks`}
                        {record.type === 'weekly_update' && `${record.data.weight} kg`}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">No health records yet</p>
              <button
                onClick={() => {
                  setShowAddRecord(true);
                  setActiveTab('records');
                }}
                className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Add Your First Record
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderRecords = () => (
    <div className="space-y-6">
      {/* Add Record Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Health Records</h2>
        <button
          onClick={() => setShowAddRecord(true)}
          className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Record</span>
        </button>
      </div>

      {/* Records List */}
      <div className="grid grid-cols-1 gap-4">
        {healthRecords
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .map((record) => (
            <div key={record.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    record.type === 'blood_pressure' ? 'bg-red-100' :
                    record.type === 'sugar_level' ? 'bg-blue-100' :
                    record.type === 'baby_movement' ? 'bg-green-100' :
                    'bg-purple-100'
                  }`}>
                    {record.type === 'blood_pressure' && <Activity className="w-5 h-5 text-red-600" />}
                    {record.type === 'sugar_level' && <Droplets className="w-5 h-5 text-blue-600" />}
                    {record.type === 'baby_movement' && <Zap className="w-5 h-5 text-green-600" />}
                    {record.type === 'weekly_update' && <Weight className="w-5 h-5 text-purple-600" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 capitalize">
                      {record.type.replace('_', ' ')}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {new Date(record.date).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {record.type === 'blood_pressure' && (
                  <>
                    <div>
                      <p className="text-xs text-gray-500">Systolic</p>
                      <p className="font-semibold">{record.data.systolic} mmHg</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Diastolic</p>
                      <p className="font-semibold">{record.data.diastolic} mmHg</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Heart Rate</p>
                      <p className="font-semibold">{record.data.heartRate} bpm</p>
                    </div>
                  </>
                )}
                
                {record.type === 'sugar_level' && (
                  <>
                    <div>
                      <p className="text-xs text-gray-500">Level</p>
                      <p className="font-semibold">{record.data.level} mg/dL</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Test Type</p>
                      <p className="font-semibold capitalize">{record.data.testType.replace('_', ' ')}</p>
                    </div>
                  </>
                )}
                
                {record.type === 'baby_movement' && (
                  <>
                    <div>
                      <p className="text-xs text-gray-500">Kick Count</p>
                      <p className="font-semibold">{record.data.count}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Duration</p>
                      <p className="font-semibold">{record.data.duration} min</p>
                    </div>
                  </>
                )}
                
                {record.type === 'weekly_update' && (
                  <>
                    <div>
                      <p className="text-xs text-gray-500">Weight</p>
                      <p className="font-semibold">{record.data.weight} kg</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Mood</p>
                      <p className="font-semibold">{record.data.mood}/10</p>
                    </div>
                  </>
                )}
              </div>
              
              {record.data.notes && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Notes</p>
                  <p className="text-sm text-gray-700">{record.data.notes}</p>
                </div>
              )}
            </div>
          ))}
      </div>

      {healthRecords.length === 0 && (
        <div className="text-center py-12">
          <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No health records yet</h3>
          <p className="text-gray-600 mb-6">Start tracking your health by adding your first record</p>
          <button
            onClick={() => setShowAddRecord(true)}
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Add Your First Record
          </button>
        </div>
      )}
    </div>
  );

  const renderAddRecordForm = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Add Health Record</h3>
        <button
          onClick={() => setShowAddRecord(false)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Record Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">Record Type</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => setRecordType('blood_pressure')}
            className={`p-4 rounded-lg border-2 transition-all ${
              recordType === 'blood_pressure'
                ? 'border-red-500 bg-red-50 text-red-700'
                : 'border-gray-200 hover:border-red-300'
            }`}
          >
            <Activity className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm font-medium">Blood Pressure</span>
          </button>
          
          <button
            onClick={() => setRecordType('sugar_level')}
            className={`p-4 rounded-lg border-2 transition-all ${
              recordType === 'sugar_level'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <Droplets className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm font-medium">Sugar Level</span>
          </button>
          
          <button
            onClick={() => setRecordType('baby_movement')}
            className={`p-4 rounded-lg border-2 transition-all ${
              recordType === 'baby_movement'
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-200 hover:border-green-300'
            }`}
          >
            <Zap className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm font-medium">Baby Movement</span>
          </button>
          
          <button
            onClick={() => setRecordType('weekly_update')}
            className={`p-4 rounded-lg border-2 transition-all ${
              recordType === 'weekly_update'
                ? 'border-purple-500 bg-purple-50 text-purple-700'
                : 'border-gray-200 hover:border-purple-300'
            }`}
          >
            <Weight className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm font-medium">Weekly Update</span>
          </button>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {recordType === 'blood_pressure' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Systolic (mmHg)
                </label>
                <input
                  type="number"
                  value={bloodPressureForm.systolic}
                  onChange={(e) => setBloodPressureForm({...bloodPressureForm, systolic: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="120"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diastolic (mmHg)
                </label>
                <input
                  type="number"
                  value={bloodPressureForm.diastolic}
                  onChange={(e) => setBloodPressureForm({...bloodPressureForm, diastolic: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="80"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heart Rate (bpm)
                </label>
                <input
                  type="number"
                  value={bloodPressureForm.heartRate}
                  onChange={(e) => setBloodPressureForm({...bloodPressureForm, heartRate: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="72"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (optional)
              </label>
              <textarea
                value={bloodPressureForm.notes}
                onChange={(e) => setBloodPressureForm({...bloodPressureForm, notes: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                rows={3}
                placeholder="Any additional notes..."
              />
            </div>
          </>
        )}

        {recordType === 'sugar_level' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sugar Level (mg/dL)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={sugarLevelForm.level}
                  onChange={(e) => setSugarLevelForm({...sugarLevelForm, level: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Type
                </label>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (optional)
              </label>
              <textarea
                value={sugarLevelForm.notes}
                onChange={(e) => setSugarLevelForm({...sugarLevelForm, notes: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Any additional notes..."
              />
            </div>
          </>
        )}

        {recordType === 'baby_movement' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kick Count
                </label>
                <input
                  type="number"
                  value={babyMovementForm.count}
                  onChange={(e) => setBabyMovementForm({...babyMovementForm, count: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={babyMovementForm.duration}
                  onChange={(e) => setBabyMovementForm({...babyMovementForm, duration: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="60"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (optional)
              </label>
              <textarea
                value={babyMovementForm.notes}
                onChange={(e) => setBabyMovementForm({...babyMovementForm, notes: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows={3}
                placeholder="Any additional notes..."
              />
            </div>
          </>
        )}

        {recordType === 'weekly_update' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={weeklyUpdateForm.weight}
                  onChange={(e) => setWeeklyUpdateForm({...weeklyUpdateForm, weight: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="65.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mood (1-10)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={weeklyUpdateForm.mood}
                  onChange={(e) => setWeeklyUpdateForm({...weeklyUpdateForm, mood: parseInt(e.target.value)})}
                  className="w-full"
                />
                <div className="text-center mt-1">
                  <span className="text-lg font-semibold text-purple-600">{weeklyUpdateForm.mood}/10</span>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (optional)
              </label>
              <textarea
                value={weeklyUpdateForm.notes}
                onChange={(e) => setWeeklyUpdateForm({...weeklyUpdateForm, notes: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={3}
                placeholder="How are you feeling this week?"
              />
            </div>
          </>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-3 mt-6">
        <button
          onClick={() => setShowAddRecord(false)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmitRecord}
          disabled={isSubmitting}
          className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <Clock className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Record</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderNutritionChat = () => {
    const currentWeek = patient.currentWeek || 1;
    const currentMonth = Math.ceil(currentWeek / 4.33);
    
    const nutritionData = {
      macronutrients: [
        {
          name: "Protein",
          dailyNeed: "71g",
          importance: "Essential for baby's growth and development",
          sources: ["Lean meats", "Fish", "Eggs", "Beans", "Nuts", "Dairy products"]
        },
        {
          name: "Carbohydrates",
          dailyNeed: "175g",
          importance: "Primary energy source for you and your baby",
          sources: ["Whole grains", "Fruits", "Vegetables", "Legumes"]
        },
        {
          name: "Healthy Fats",
          dailyNeed: "20-35% of calories",
          importance: "Brain development and nutrient absorption",
          sources: ["Avocados", "Nuts", "Olive oil", "Fatty fish", "Seeds"]
        }
      ],
      micronutrients: [
        {
          name: "Folic Acid",
          dailyNeed: "600mcg",
          importance: "Prevents neural tube defects",
          sources: ["Leafy greens", "Fortified cereals", "Citrus fruits", "Beans"]
        },
        {
          name: "Iron",
          dailyNeed: "27mg",
          importance: "Prevents anemia and supports increased blood volume",
          sources: ["Red meat", "Spinach", "Lentils", "Fortified cereals"]
        },
        {
          name: "Calcium",
          dailyNeed: "1000mg",
          importance: "Baby's bone and teeth development",
          sources: ["Dairy products", "Leafy greens", "Fortified foods", "Sardines"]
        },
        {
          name: "DHA (Omega-3)",
          dailyNeed: "200mg",
          importance: "Brain and eye development",
          sources: ["Fatty fish", "Walnuts", "Flaxseeds", "DHA supplements"]
        }
      ],
      foodsToAvoid: {
        1: ["Raw fish/sushi", "Unpasteurized dairy", "High-mercury fish", "Raw eggs", "Alcohol"],
        2: ["Deli meats", "Soft cheeses", "Raw sprouts", "Unwashed produce", "Caffeine (limit)"],
        3: ["Large fish (shark, swordfish)", "Raw shellfish", "Unpasteurized juices", "Herbal teas (some)", "Artificial sweeteners"],
        4: ["High-sodium foods", "Processed meats", "Raw cookie dough", "Unwashed fruits/vegetables", "Excess sugar"],
        5: ["Spicy foods (if causing heartburn)", "Carbonated drinks", "High-fat foods", "Large meals", "Late-night eating"],
        6: ["Foods causing gas", "Very cold drinks", "Excessive dairy", "Fried foods", "Citrus (if causing heartburn)"],
        7: ["Salty snacks", "Sugary drinks", "Heavy meals", "Foods causing bloating", "Excess fluids before bed"],
        8: ["Large portions", "Spicy foods", "Acidic foods", "Carbonated beverages", "Foods high in sodium"],
        9: ["Hard-to-digest foods", "Very sweet foods", "Excess fluids", "Large meals", "Foods causing discomfort"]
      },
      exercises: {
        1: ["Walking (20-30 min)", "Swimming", "Prenatal yoga", "Pelvic tilts", "Deep breathing"],
        2: ["Light cardio", "Stretching", "Kegel exercises", "Modified planks", "Arm circles"],
        3: ["Prenatal pilates", "Stationary cycling", "Wall push-ups", "Leg lifts", "Cat-cow stretches"],
        4: ["Water aerobics", "Modified squats", "Prenatal dance", "Shoulder rolls", "Ankle circles"],
        5: ["Walking", "Swimming", "Prenatal yoga", "Pelvic floor exercises", "Gentle stretching"],
        6: ["Low-impact cardio", "Prenatal strength training", "Balance exercises", "Hip circles", "Breathing exercises"],
        7: ["Walking", "Swimming", "Prenatal yoga", "Wall sits", "Calf raises"],
        8: ["Gentle walking", "Water exercises", "Stretching", "Pelvic tilts", "Relaxation techniques"],
        9: ["Light walking", "Prenatal yoga", "Breathing exercises", "Gentle stretching", "Meditation"]
      }
    };

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Nutrition Chat - Month {currentMonth}</h2>
          <p className="text-green-100">Personalized nutrition guidance for your pregnancy journey</p>
        </div>

        {/* Macronutrients */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <Weight className="w-5 h-5 text-blue-600" />
            </div>
            Macronutrients
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {nutritionData.macronutrients.map((macro, index) => (
              <div key={index} className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">{macro.name}</h4>
                <p className="text-sm text-blue-600 mb-2">Daily Need: <span className="font-bold">{macro.dailyNeed}</span></p>
                <p className="text-sm text-gray-700 mb-3">{macro.importance}</p>
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">Good Sources:</p>
                  <div className="flex flex-wrap gap-1">
                    {macro.sources.map((source, idx) => (
                      <span key={idx} className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
                        {source}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Micronutrients */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <Droplets className="w-5 h-5 text-purple-600" />
            </div>
            Essential Micronutrients
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {nutritionData.micronutrients.map((micro, index) => (
              <div key={index} className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-semibold text-purple-800 mb-2">{micro.name}</h4>
                <p className="text-sm text-purple-600 mb-2">Daily Need: <span className="font-bold">{micro.dailyNeed}</span></p>
                <p className="text-sm text-gray-700 mb-3">{micro.importance}</p>
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">Good Sources:</p>
                  <div className="flex flex-wrap gap-1">
                    {micro.sources.map((source, idx) => (
                      <span key={idx} className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full">
                        {source}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Foods to Avoid This Month */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            Foods to Avoid - Month {currentMonth}
          </h3>
          <div className="bg-red-50 rounded-lg p-4">
            <p className="text-sm text-gray-700 mb-3">
              During month {currentMonth} of pregnancy, it's especially important to avoid these foods:
            </p>
            <div className="flex flex-wrap gap-2">
              {nutritionData.foodsToAvoid[currentMonth as keyof typeof nutritionData.foodsToAvoid]?.map((food, index) => (
                <span key={index} className="bg-red-200 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                  {food}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended Exercises */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <Activity className="w-5 h-5 text-green-600" />
            </div>
            Recommended Exercises - Month {currentMonth}
          </h3>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-gray-700 mb-3">
              Safe and beneficial exercises for month {currentMonth} of your pregnancy:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {nutritionData.exercises[currentMonth as keyof typeof nutritionData.exercises]?.map((exercise, index) => (
                <div key={index} className="bg-white rounded-lg p-3 border border-green-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-800">{exercise}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800">
                <strong>Important:</strong> Always consult with your healthcare provider before starting any new exercise routine during pregnancy.
              </p>
            </div>
          </div>
        </div>

        {/* Hydration Reminder */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center mr-3">
              <Droplets className="w-5 h-5 text-cyan-600" />
            </div>
            Hydration Goals
          </h3>
          <div className="bg-cyan-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-semibold text-cyan-800">Daily Water Goal</span>
              <span className="text-2xl font-bold text-cyan-600">8-10 glasses</span>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              Staying well-hydrated is crucial during pregnancy for maintaining amniotic fluid levels, preventing constipation, and supporting increased blood volume.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-700 mb-1">Benefits:</p>
                <ul className="text-gray-600 space-y-1">
                  <li>• Reduces morning sickness</li>
                  <li>• Prevents urinary tract infections</li>
                  <li>• Helps with digestion</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-gray-700 mb-1">Tips:</p>
                <ul className="text-gray-600 space-y-1">
                  <li>• Drink small amounts frequently</li>
                  <li>• Add lemon for flavor</li>
                  <li>• Monitor urine color</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
              <CheckCircle className="w-5 h-5 text-yellow-600" />
            </div>
            Quick Nutrition Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">Meal Planning</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Eat small, frequent meals</li>
                <li>• Include protein in every meal</li>
                <li>• Choose whole grains over refined</li>
                <li>• Prep healthy snacks in advance</li>
              </ul>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">Managing Symptoms</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Ginger for morning sickness</li>
                <li>• Fiber-rich foods for constipation</li>
                <li>• Small meals for heartburn</li>
                <li>• Iron-rich foods for fatigue</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (showAddRecord) {
      return renderAddRecordForm();
    }

    switch (activeTab) {
      case 'records':
        return renderRecords();
      case 'nutrition':
        return renderNutritionChat();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome back, {patient.name}
          </h1>
          <p className="text-gray-600">
            Track your pregnancy journey and stay healthy
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl p-1 shadow-sm border border-gray-100 mb-6">
          <nav className="flex space-x-1">
            <button
              onClick={() => {
                setActiveTab('overview');
                setShowAddRecord(false);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'overview' && !showAddRecord
                  ? 'bg-pink-500 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => {
                setActiveTab('records');
                setShowAddRecord(false);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'records' && !showAddRecord
                  ? 'bg-pink-500 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Health Records
            </button>
            <button
              onClick={() => {
                setActiveTab('appointments');
                setShowAddRecord(false);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'appointments'
                  ? 'bg-pink-500 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Appointments
            </button>
            <button
              onClick={() => {
                setActiveTab('nutrition');
                setShowAddRecord(false);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'nutrition'
                  ? 'bg-pink-500 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Nutrition Chat
            </button>
          </nav>
        </div>

        {renderContent()}
      </div>
    </div>
  );
};

export default PatientDashboard;