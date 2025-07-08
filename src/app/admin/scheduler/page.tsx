import Calender from "@/components/scheduler/Calender";
import { Suspense } from "react";

const SchedulerComponent = () => {
    return (
        // <p>This is the Admin Dashboard page...</p>
        // <Calender />
        <Suspense fallback={<div>Loading...</div>}>
            <Calender />
        </Suspense>
    );
}
export default SchedulerComponent;