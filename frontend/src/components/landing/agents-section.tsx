import React from 'react';
import { motion } from 'framer-motion';

const AgentsSection = () => {
  const agents = [
    {
      title: "Authentication Agent",
      responsibility: "User identity and session trust",
      input: "Login/signup intent",
      output: "Verified user identity (JWT)",
      description: "Handles all aspects of user identity verification and session management. Processes user login and signup requests, validates credentials, and establishes trusted sessions through JWT tokens."
    },
    {
      title: "Task Management Agent",
      responsibility: "Task lifecycle handling",
      input: "User task actions",
      output: "User-scoped task state",
      description: "Manages the complete lifecycle of user tasks from creation to completion. Processes user actions related to tasks such as creating, updating, deleting, and marking tasks as complete."
    },
    {
      title: "Data Isolation Agent",
      responsibility: "Enforce per-user data boundaries",
      input: "Authenticated user context",
      output: "Filtered database access",
      description: "Ensures that users can only access their own data by enforcing strict data boundaries. Takes the authenticated user context and applies appropriate filters to database queries."
    },
    {
      title: "API Gateway Agent",
      responsibility: "Request validation and routing",
      input: "HTTP requests with JWT",
      output: "Authorized backend execution",
      description: "Serves as the entry point for all API requests, validating incoming requests and routing them to appropriate backend services. Verifies JWT tokens for authentication."
    },
    {
      title: "UI Orchestration Agent",
      responsibility: "Frontend state and flow control",
      input: "User interactions",
      output: "Consistent, responsive UI behavior",
      description: "Manages the frontend application state and controls user interface flows. Processes user interactions, coordinates state changes across different UI components."
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            System Agent Architecture
          </h2>
          <p className="mt-4 text-lg max-w-2xl mx-auto text-gray-500">
            Our system is organized using conceptual responsibility boundaries for clear separation of concerns.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center">
                  <div className="bg-indigo-100 rounded-lg p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{agent.title}</h3>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Responsibility:</span>
                    <span className="text-gray-500 ml-2">{agent.responsibility}</span>
                  </div>

                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Input:</span>
                    <span className="text-gray-500 ml-2">{agent.input}</span>
                  </div>

                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Output:</span>
                    <span className="text-gray-500 ml-2">{agent.output}</span>
                  </div>
                </div>

                <p className="mt-4 text-sm text-gray-500">
                  {agent.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgentsSection;