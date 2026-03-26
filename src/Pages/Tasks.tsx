import Navbar from "../components/Navbar";

function Task() {
    return (
        <div className="flex h-screen overflow-hidden bg-bg">
            <Navbar />
            <div className="flex-1 relative bg-bg transition-colors duration-200">
                <h1>Task</h1>
            </div>
        </div>
    );
}

export default Task;