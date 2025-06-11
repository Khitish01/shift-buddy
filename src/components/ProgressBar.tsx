'use client';

interface WorkflowStep {
    id: number;
    title: string;
    timestamp: string;
    icon: string;
    completed: boolean;
}

interface WorkflowStatusProps {
    currentStatus: number; // The current completed step (1-5)
    taskId?: string;
}

const Progressbar = ({ currentStatus = 5, taskId = "ID09876" }: WorkflowStatusProps) => {
    const workflowSteps: WorkflowStep[] = [
        {
            id: 1,
            title: 'Started Journey',
            timestamp: '20 July 2025, 0:34 PM',
            icon: '/icons/progress-icon-1.svg',
            completed: currentStatus >= 1,
        },
        {
            id: 2,
            title: 'Reached',
            timestamp: '20 July 2025, 13:34 PM',
            icon: '/icons/progress-icon-1.svg',
            completed: currentStatus >= 2,
        },
        {
            id: 3,
            title: 'Start Treatment',
            timestamp: '20 July 2025, 13:54 PM',
            icon: '/icons/progress-icon-1.svg',
            completed: currentStatus >= 3,
        },
        {
            id: 4,
            title: 'Progress Report',
            timestamp: '20 July 2025, 13:34 PM',
            icon: '/icons/progress-icon-1.svg',
            completed: currentStatus >= 4,
        },
        {
            id: 5,
            title: 'Feedback',
            timestamp: '20 July 2025, 13:34 PM',
            icon: '/icons/progress-icon-1.svg',
            completed: currentStatus >= 5,
        },
    ];

    const isFullyCompleted = currentStatus >= workflowSteps.length;

    return (
        <div className="">
            {/* Header */}


            {/* Workflow Steps */}
            <div className="px-6 py-6 bg-[#FDF9FF]">
                <div className="relative">
                    {/* Steps */}
                    <div className="space-y-0">
                        {workflowSteps.map((step, index) => (
                            <div key={step.id} className="relative flex items-start">
                                {/* Connector Line - Only show if not the last step */}
                                {index < workflowSteps.length - 1 && (
                                    <div
                                        className={` absolute left-[10px] top-6 w-[4px] h-[3.75rem] transition-all duration-500 z-0
                      ${step.completed && currentStatus > step.id
                                                ? 'bg-[#69417E]'
                                                : 'bg-gray-200'
                                            }
                    `}
                                    />
                                )}

                                {/* Step Circle */}
                                <div
                                    className={`
                    relative z-10 flex items-center justify-center w-6 h-6 rounded-full border-2 
                    transition-all duration-500 ease-in-out
                    ${step.completed
                                            ? 'bg-[#69417E] border-[#69417E] text-white shadow-lg'
                                            : 'bg-white border-gray-300 text-gray-400'
                                        }
                  `}
                                >
                                    {step.completed ? (
                                        <svg
                                            className="w-4 h-4"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    ) : (
                                        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                                    )}
                                </div>

                                {/* Step Content */}
                                <div className="ml-4 flex-1 min-w-0 pb-12">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3 className={`
                        text-sm font-medium transition-colors duration-500
                        ${step.completed ? 'text-gray-900' : 'text-gray-500'}
                      `}>
                                                {step.title}
                                            </h3>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {step.timestamp}
                                            </p>
                                        </div>

                                        {/* Status Indicator */}
                                        {/* <div className={`
                      ml-3 px-2 py-1 rounded-full text-xs font-medium transition-all duration-500
                      ${step.completed
                                                ? 'bg-[#69417E] bg-opacity-10 text-[#69417E]'
                                                : 'bg-gray-100 text-gray-400'
                                            }
                    `}>
                                            {step.completed ? 'Done' : 'Pending'}
                                        </div> */}
                                        <div>
                                            <img src={step.icon} alt="" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Overall Status */}
            <div className="mt-3">
                <div className={`w-[30%]
          py-3 px-4 rounded-full text-center font-medium text-sm transition-all duration-500 text-white
          ${!isFullyCompleted
                        ? 'bg-[#69417E]'
                        : 'bg-[#CECDCD]'
                    }
        `}>
                    {isFullyCompleted ? 'Completed' : `In Progress (${currentStatus}/${workflowSteps.length})`}
                </div>
            </div>

            {/* Progress Bar */}
            {/* <div className="px-6 pb-6">
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-[#69417E] h-2 rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${(currentStatus / workflowSteps.length) * 100}%` }}
                    />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>Start</span>
                    <span>{Math.round((currentStatus / workflowSteps.length) * 100)}% Complete</span>
                    <span>End</span>
                </div>
            </div> */}
        </div>
    );
};

export default Progressbar;