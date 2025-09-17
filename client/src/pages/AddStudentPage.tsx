import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { studentsAPI, classesAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { 
  UserCircleIcon,
  AcademicCapIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CalendarIcon,
  UserGroupIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

interface StudentFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  guardianOccupation: string;
  guardianCNIC: string;
  motherName: string;
  motherPhone: string;
  motherOccupation: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  classId: string;
  section: string;
  admissionDate: string;
  bloodGroup: string;
  allergies: string;
  medicalConditions: string;
  monthlyFee: number;
}

export const AddStudentPage = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [classes, setClasses] = useState<Array<{ id: string; name: string; sections: Array<{ name: string; maxStudents: number; currentStudents: number }> }>>([]);

  // Reusable input classes for consistent styling
  const inputClasses = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200";
  const selectClasses = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200";
  const textareaClasses = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200";

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<StudentFormData>({
    defaultValues: {
      admissionDate: new Date().toISOString().split('T')[0],
      monthlyFee: 2000,
      section: ''
    }
  });

  // Load classes from API
  useEffect(() => {
    const load = async () => {
      try {
        const res = await classesAPI.getAll();
        const list = (res.data?.classes || res.data || []).map((c: any) => ({
          id: c._id || c.id,
          name: c.name,
          sections: c.sections || []
        }));
        setClasses(list);
      } catch (e) {
        toast.error('Failed to load classes');
      }
    };
    load();
  }, []);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const onSubmit = async (data: StudentFormData) => {
    setIsSubmitting(true);
    try {
      // Use the API service instead of direct fetch
      const response = await studentsAPI.create({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth,
        address: data.address,
        currentClass: data.classId, // must be a MongoId
        section: data.section,
        rollNumber: String(Math.floor(Math.random() * 50) + 1).padStart(3, '0'),
        guardian: {
          father: {
            name: data.guardianName,
            phone: data.guardianPhone,
            occupation: data.guardianOccupation,
            cnic: data.guardianCNIC
          },
          mother: {
            name: data.motherName,
            phone: data.motherPhone,
            occupation: data.motherOccupation
          },
          emergencyContact: {
            name: data.emergencyContactName,
            relationship: data.emergencyContactRelationship,
            phone: data.emergencyContactPhone
          }
        },
        health: {
          bloodGroup: data.bloodGroup,
          allergies: data.allergies ? data.allergies.split(',').map(a => a.trim()) : [],
          medicalConditions: data.medicalConditions ? data.medicalConditions.split(',').map(c => c.trim()) : []
        }
      });
      
      toast.success('Student added successfully!');
      navigate('/students');
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Failed to add student');
      console.error('Error adding student:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div key={i} className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
              i + 1 <= currentStep 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              {i + 1}
            </div>
            {i < totalSteps - 1 && (
              <div className={`w-16 h-1 mx-2 ${
                i + 1 < currentStep ? 'bg-primary-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return null;
  }
  if (!user || (user.role !== 'nazim' && user.role !== 'raises_jamia')) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <button
            onClick={() => navigate('/students')}
            className="mr-4 p-2 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Student</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Complete all steps to register a new student</p>
          </div>
        </div>
        <StepIndicator />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition-colors duration-200">
            <div className="flex items-center mb-6">
              <UserCircleIcon className="h-6 w-6 text-primary-600 mr-2" />
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Personal Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  First Name *
                </label>
                <input
                  {...register('firstName', { required: 'First name is required' })}
                  className={inputClasses}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Last Name *
                </label>
                <input
                  {...register('lastName', { required: 'Last name is required' })}
                  className={inputClasses}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className={inputClasses}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  {...register('phone', { required: 'Phone is required' })}
                  className={inputClasses}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  {...register('dateOfBirth', { required: 'Date of birth is required' })}
                  className={inputClasses}
                />
                {errors.dateOfBirth && (
                  <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Blood Group
                </label>
                <select
                  {...register('bloodGroup')}
                  className={selectClasses}
                >
                  <option value="">Select Blood Group</option>
                  {bloodGroups.map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Address *
                </label>
                <textarea
                  {...register('address', { required: 'Address is required' })}
                  rows={3}
                  className={textareaClasses}
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Allergies (comma-separated)
                </label>
                <input
                  {...register('allergies')}
                  placeholder="e.g., Peanuts, Dust"
                  className={inputClasses}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Medical Conditions (comma-separated)
                </label>
                <input
                  {...register('medicalConditions')}
                  placeholder="e.g., Asthma, Diabetes"
                  className={inputClasses}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Guardian Information */}
        {currentStep === 2 && (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition-colors duration-200">
            <div className="flex items-center mb-6">
              <UserGroupIcon className="h-6 w-6 text-primary-600 mr-2" />
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Guardian Information</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Father's Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Father's Name *
                    </label>
                    <input
                      {...register('guardianName', { required: 'Father\'s name is required' })}
                      className={inputClasses}
                    />
                    {errors.guardianName && (
                      <p className="mt-1 text-sm text-red-600">{errors.guardianName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Father's Phone *
                    </label>
                    <input
                      type="tel"
                      {...register('guardianPhone', { required: 'Father\'s phone is required' })}
                      className={inputClasses}
                    />
                    {errors.guardianPhone && (
                      <p className="mt-1 text-sm text-red-600">{errors.guardianPhone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Father's Occupation
                    </label>
                    <input
                      {...register('guardianOccupation')}
                      className={inputClasses}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Father's CNIC
                    </label>
                    <input
                      {...register('guardianCNIC')}
                      placeholder="12345-1234567-1"
                      className={inputClasses}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Father's Email
                    </label>
                    <input
                      type="email"
                      {...register('guardianEmail')}
                      className={inputClasses}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Mother's Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Mother's Name
                    </label>
                    <input
                      {...register('motherName')}
                      className={inputClasses}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Mother's Phone
                    </label>
                    <input
                      type="tel"
                      {...register('motherPhone')}
                      className={inputClasses}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Mother's Occupation
                    </label>
                    <input
                      {...register('motherOccupation')}
                      className={inputClasses}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Emergency Contact Name *
                    </label>
                    <input
                      {...register('emergencyContactName', { required: 'Emergency contact name is required' })}
                      className={inputClasses}
                    />
                    {errors.emergencyContactName && (
                      <p className="mt-1 text-sm text-red-600">{errors.emergencyContactName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Emergency Contact Phone *
                    </label>
                    <input
                      type="tel"
                      {...register('emergencyContactPhone', { required: 'Emergency contact phone is required' })}
                      className={inputClasses}
                    />
                    {errors.emergencyContactPhone && (
                      <p className="mt-1 text-sm text-red-600">{errors.emergencyContactPhone.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Relationship *
                    </label>
                    <select
                      {...register('emergencyContactRelationship', { required: 'Relationship is required' })}
                      className={selectClasses}
                    >
                      <option value="">Select Relationship</option>
                      <option value="Uncle">Uncle</option>
                      <option value="Aunt">Aunt</option>
                      <option value="Grandfather">Grandfather</option>
                      <option value="Grandmother">Grandmother</option>
                      <option value="Cousin">Cousin</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.emergencyContactRelationship && (
                      <p className="mt-1 text-sm text-red-600">{errors.emergencyContactRelationship.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Academic Information */}
        {currentStep === 3 && (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition-colors duration-200">
            <div className="flex items-center mb-6">
              <AcademicCapIcon className="h-6 w-6 text-primary-600 mr-2" />
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Academic Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Class *
                </label>
                <select
                  {...register('classId', { required: 'Class is required' })}
                  className={selectClasses}
                >
                  <option value="">Select Class</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
                {errors.classId && (
                  <p className="mt-1 text-sm text-red-600">{errors.classId.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Section *
                </label>
                <select
                  {...register('section', { required: 'Section is required' })}
                  className={selectClasses}
                >
                  <option value="">Select Section</option>
                  {classes
                    .find(c => c.id === watch('classId'))?.sections
                    .map((s) => (
                      <option key={s.name} value={s.name}>{s.name}</option>
                    ))}
                </select>
                {errors.section && (
                  <p className="mt-1 text-sm text-red-600">{errors.section.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Admission Date *
                </label>
                <input
                  type="date"
                  {...register('admissionDate', { required: 'Admission date is required' })}
                  className={inputClasses}
                />
                {errors.admissionDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.admissionDate.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Monthly Fee (PKR)
                </label>
                <input
                  type="number"
                  {...register('monthlyFee', { 
                    required: 'Monthly fee is required',
                    min: { value: 0, message: 'Fee must be positive' }
                  })}
                  className={inputClasses}
                />
                {errors.monthlyFee && (
                  <p className="mt-1 text-sm text-red-600">{errors.monthlyFee.message}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review & Submit */}
        {currentStep === 4 && (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition-colors duration-200">
            <div className="flex items-center mb-6">
              <CalendarIcon className="h-6 w-6 text-primary-600 mr-2" />
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Review & Submit</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Personal Information</h3>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md transition-colors duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-900 dark:text-gray-100">
                    <div><span className="font-medium">Name:</span> {watch('firstName')} {watch('lastName')}</div>
                    <div><span className="font-medium">Email:</span> {watch('email')}</div>
                    <div><span className="font-medium">Phone:</span> {watch('phone')}</div>
                    <div><span className="font-medium">Date of Birth:</span> {watch('dateOfBirth')}</div>
                    <div><span className="font-medium">Blood Group:</span> {watch('bloodGroup') || 'Not specified'}</div>
                    <div><span className="font-medium">Address:</span> {watch('address')}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Guardian Information</h3>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md transition-colors duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-900 dark:text-gray-100">
                    <div><span className="font-medium">Father:</span> {watch('guardianName')}</div>
                    <div><span className="font-medium">Father's Phone:</span> {watch('guardianPhone')}</div>
                    <div><span className="font-medium">Mother:</span> {watch('motherName') || 'Not specified'}</div>
                    <div><span className="font-medium">Emergency Contact:</span> {watch('emergencyContactName')}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Academic Information</h3>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md transition-colors duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-900 dark:text-gray-100">
                    <div><span className="font-medium">Class:</span> {classes.find(c => c.id === watch('classId'))?.name || 'Not selected'}</div>
                    <div><span className="font-medium">Admission Date:</span> {watch('admissionDate')}</div>
                    <div><span className="font-medium">Monthly Fee:</span> PKR {watch('monthlyFee')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`px-4 py-2 border border-gray-300 rounded-md text-sm font-medium ${
              currentStep === 1 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Previous
          </button>

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-primary-600 hover:bg-primary-700'
              }`}
            >
              {isSubmitting ? 'Adding Student...' : 'Add Student'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};


