interface CheckoutStepsProps {
  currentStep: number;
}

const CheckoutSteps = ({ currentStep }: CheckoutStepsProps) => {
  const steps = [
    { number: 1, name: 'Shipping' },
    { number: 2, name: 'Review' },
    { number: 3, name: 'Payment' },
  ];

  return (
    <div className="flex justify-center">
      <div className="flex w-full max-w-3xl justify-between">
        {steps.map((step) => (
          <div key={step.number} className="flex flex-col items-center">
            <div 
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                step.number < currentStep 
                  ? 'bg-primary border-primary text-white' 
                  : step.number === currentStep 
                    ? 'border-primary text-primary' 
                    : 'border-gray-300 text-gray-300'
              }`}
            >
              {step.number < currentStep ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              ) : (
                <span>{step.number}</span>
              )}
            </div>
            <span 
              className={`mt-2 text-sm ${
                step.number <= currentStep ? 'text-gray-900 font-medium' : 'text-gray-500'
              }`}
            >
              {step.name}
            </span>
            
            {/* Connector line */}
            {step.number !== steps.length && (
              <div className="hidden sm:block absolute top-5 left-0 w-full">
                <div 
                  className={`h-0.5 w-full ${
                    step.number < currentStep ? 'bg-primary' : 'bg-gray-300'
                  }`}
                ></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckoutSteps;