export default function OrderTracker({ status }) {
  const steps = ["Pending", "Shipped", "Out for Delivery", "Delivered"];

  const currentStep = steps.indexOf(status);

  return (
    <div className="flex items-center gap-4 mt-4 flex-wrap">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm
              ${index <= currentStep ? "bg-green-500" : "bg-gray-300"}`}
          >
            {index + 1}
          </div>

          <span
            className={
              index <= currentStep
                ? "text-green-600 font-semibold"
                : "text-gray-400"
            }
          >
            {step}
          </span>

          {index < steps.length - 1 && (
            <div className="w-10 h-1 bg-gray-300"></div>
          )}
        </div>
      ))}
    </div>
  );
}
