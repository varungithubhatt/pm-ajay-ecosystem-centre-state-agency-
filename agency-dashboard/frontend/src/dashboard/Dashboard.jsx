import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { FaTasks, FaMoneyBillWave, FaChartLine, FaHistory, FaCommentDots } from 'react-icons/fa';
import Task from './Task';

function Dashboard() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Tasks Assigned",
      description: "All the tasks assigned",
      icon: <FaTasks className="text-4xl" />,
      color: "from-purple-400 to-indigo-500",
      link: "/task",
    },
    {
      title: "Remaining Funds",
      description: "Remaining Funds and Funds Mapping",
      icon: <FaMoneyBillWave className="text-4xl" />,
      color: "from-green-400 to-teal-500",
      link: "/funds",
    },
    {
      title: "Progress",
      description: "Current Progress and reports of the tasks assigned",
      icon: <FaChartLine className="text-4xl" />,
      color: "from-yellow-400 to-orange-500",
      link: "/progress",
    },
    {
      title: "Previous Tasks",
      description: "All previously completed tasks",
      icon: <FaHistory className="text-4xl" />,
      color: "from-pink-400 to-red-500",
      link: "/previous-tasks",
      fullWidth: true,
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden overflow-y-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-white px-4 md:px-8 pt-20 relative">
      <Navbar />

      {/* Dashboard Cards except Previous Tasks */}
      <main className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-full mx-auto mt-6">
        {cards
          .filter(card => !card.fullWidth)
          .map((card, idx) => (
            <section
              key={idx}
              onClick={() => navigate(card.link)}
              className={`cursor-pointer rounded-xl p-3 flex flex-col items-center justify-center shadow-lg transition duration-300 hover:scale-105 hover:shadow-2xl bg-gradient-to-br ${card.color} w-full`}
            >
              <div className="text-white mb-2">{card.icon}</div>
              <h1 className="text-3xl font-bold text-white text-center">
                {card.title}
              </h1>
              <p className="text-white text-lg text-center mt-2  md:text-sm opacity-90">
                {card.description}
              </p>
            </section>
        ))}
      </main>

        <Task />
      

      {/* Previous Tasks moved below Task Component */}
      <div className="w-full max-w-xl max-h-3xl mx-auto mt-6 mb-9 flex justify-center">
        <section
          onClick={() => navigate(cards.find(card => card.fullWidth).link)}
          className="cursor-pointer rounded-xl p-3 flex flex-col items-center justify-center shadow-lg transition bg-gradient-to-br from-pink-400 to-red-500 w-full hover:scale-105 hover:shadow-2xl"
        >
          <div className="text-white mb-2">{cards.find(card => card.fullWidth).icon}</div>
          <h2 className="text-3xl font-bold text-white text-center">
            {cards.find(card => card.fullWidth).title}
          </h2>
          <p className="text-lg text-white text-center mt-2  opacity-90">
            {cards.find(card => card.fullWidth).description}
          </p>
        </section>
      </div>

      {/* Floating Contact Admin Button */}
      <button
      type="button"
      onClick={() => {/* chat admin handler */}}
      className="fixed bottom-8 right-8 flex items-center gap-2 px-4 py-3 rounded-full bg-indigo-600 text-white shadow-xl hover:bg-indigo-700 transition duration-300 hover:scale-110 z-50 cursor-pointer"
      style={{ boxShadow: '0 4px 24px rgba(79,70,229,0.18)' }}
    >
      <FaCommentDots className="text-lg" />
      {/* Hide text on small screens, show on medium and above */}
      <span className="hidden md:inline font-semibold text-sm">Contact Admin</span>
    </button>


      {/* Decorative background shapes */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-200 rounded-full opacity-30 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-green-200 rounded-full opacity-30 blur-3xl pointer-events-none"></div>
    </div>
  );
}

export default Dashboard;
