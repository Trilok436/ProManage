import { useState } from "react";
import {
  format,
  isSameDay,
  isBefore,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
} from "date-fns";
import {
  CalendarIcon,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const typeColors = {
  BUG: "bg-red-200 text-red-800 dark:bg-red-500 dark:text-red-900",
  FEATURE: "bg-blue-200 text-blue-800 dark:bg-blue-500 dark:text-blue-900",
  TASK: "bg-green-200 text-green-800 dark:bg-green-500 dark:text-green-900",
  IMPROVEMENT:
    "bg-purple-200 text-purple-800 dark:bg-purple-500 dark:text-purple-900",
  OTHER: "bg-amber-200 text-amber-800 dark:bg-amber-500 dark:text-amber-900",
};

const priorityBorders = {
  LOW: "border-zinc-300 dark:border-zinc-600",
  MEDIUM: "border-amber-300 dark:border-amber-500",
  HIGH: "border-orange-300 dark:border-orange-500",
};

const ProjectCalendar = ({ tasks = [] }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const today = new Date();

  // Fix: Use dueDate (camelCase) and wrap in new Date()
  const getTasksForDate = (date) =>
    tasks.filter(
      (task) => task.dueDate && isSameDay(new Date(task.dueDate), date),
    );

  const upcomingTasks = tasks
    .filter(
      (task) =>
        task.dueDate &&
        !isBefore(new Date(task.dueDate), today) &&
        task.status !== "DONE",
    )
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  const overdueTasks = tasks.filter(
    (task) =>
      task.dueDate &&
      isBefore(new Date(task.dueDate), today) &&
      task.status !== "DONE",
  );

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const handleMonthChange = (direction) => {
    setCurrentMonth((prev) =>
      direction === "next" ? addMonths(prev, 1) : subMonths(prev, 1),
    );
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Calendar View */}
      <div className="lg:col-span-2 ">
        <div className="bg-white dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-zinc-300 dark:border-zinc-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-zinc-900 dark:text-white text-md flex gap-2 items-center">
              <CalendarIcon className="size-5" /> Task Calendar
            </h2>
            <div className="flex gap-2 items-center">
              <button onClick={() => handleMonthChange("prev")}>
                <ChevronLeft className="size-5 text-zinc-600 dark:text-zinc-400" />
              </button>
              <span className="text-zinc-900 dark:text-white font-medium">
                {format(currentMonth, "MMMM yyyy")}
              </span>
              <button onClick={() => handleMonthChange("next")}>
                <ChevronRight className="size-5 text-zinc-600 dark:text-zinc-400" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 text-xs text-zinc-600 dark:text-zinc-400 mb-2 text-center font-bold">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {daysInMonth.map((day) => {
              const dayTasks = getTasksForDate(day);
              const isSelected = isSameDay(day, selectedDate);
              const hasOverdue = dayTasks.some(
                (t) =>
                  t.status !== "DONE" && isBefore(new Date(t.dueDate), today),
              );

              return (
                <button
                  key={day.toString()}
                  onClick={() => setSelectedDate(day)}
                  className={`sm:h-14 h-12 rounded-md flex flex-col items-center justify-center text-sm transition-all
                                    ${isSelected ? "bg-blue-600 text-white" : "bg-zinc-50 text-zinc-900 dark:bg-zinc-800/40 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"}
                                    ${hasOverdue ? "border-2 border-red-500" : "border border-transparent"}`}
                >
                  <span className="font-semibold">{format(day, "d")}</span>
                  {dayTasks.length > 0 && (
                    <span
                      className={`text-[10px] ${isSelected ? "text-blue-100" : "text-blue-600 dark:text-blue-400"}`}
                    >
                      {dayTasks.length}{" "}
                      {dayTasks.length === 1 ? "task" : "tasks"}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tasks for Selected Day */}
        {getTasksForDate(selectedDate).length > 0 && (
          <div className="bg-white mt-6 dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-zinc-300 dark:border-zinc-800 rounded-lg p-4">
            <h3 className="text-zinc-900 dark:text-white text-lg mb-3 font-semibold">
              Tasks for {format(selectedDate, "MMM d, yyyy")}
            </h3>
            <div className="space-y-3">
              {getTasksForDate(selectedDate).map((task) => (
                <div
                  key={task.id}
                  className={`bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded border-l-4 ${priorityBorders[task.priority] || "border-zinc-300"}`}
                >
                  <div className="flex justify-between mb-2">
                    <h4 className="text-zinc-900 dark:text-white font-medium">
                      {task.title}
                    </h4>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold ${typeColors[task.type]}`}
                    >
                      {task.type}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-600 dark:text-zinc-400">
                    <span className="capitalize">
                      {task.priority?.toLowerCase()} priority
                    </span>
                    {task.assignee && (
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {task.assignee.name}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <div className="bg-white dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-800 rounded-lg p-4">
          <h3 className="text-zinc-900 dark:text-white text-sm font-bold flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4" /> Upcoming Tasks
          </h3>
          {upcomingTasks.length === 0 ? (
            <p className="text-zinc-500 text-sm text-center py-2">
              No upcoming tasks
            </p>
          ) : (
            <div className="space-y-2">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700"
                >
                  <div className="flex justify-between items-start text-sm mb-1">
                    <span className="text-zinc-900 dark:text-white font-medium">
                      {task.title}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded ${typeColors[task.type]}`}
                    >
                      {task.type}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500">
                    {format(new Date(task.dueDate), "MMM d")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {overdueTasks.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-300 dark:border-red-900 rounded-lg p-4">
            <h3 className="text-red-700 dark:text-red-400 text-sm font-bold flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-red-500" /> Overdue (
              {overdueTasks.length})
            </h3>
            <div className="space-y-2">
              {overdueTasks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  className="bg-white dark:bg-zinc-900/50 p-3 rounded-lg shadow-sm"
                >
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-zinc-900 dark:text-white">
                      {task.title}
                    </span>
                  </div>
                  <p className="text-xs text-red-600 font-semibold">
                    Due {format(new Date(task.dueDate), "MMM d")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCalendar;
