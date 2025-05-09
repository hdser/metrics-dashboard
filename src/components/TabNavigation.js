import React, { useState } from 'react';

/**
 * Hierarchical TabNavigation component for switching between dashboards and tabs
 * @param {Object} props - Component props
 * @param {Array} props.dashboards - Array of dashboard objects
 * @param {string} props.activeDashboard - Currently active dashboard
 * @param {Array} props.tabs - Array of tab objects
 * @param {string} props.activeTab - Currently active tab
 * @param {Function} props.onNavigation - Handler for navigation changes
 * @param {boolean} props.isCollapsed - Whether the sidebar is collapsed
 * @returns {JSX.Element} Tab navigation component
 */
const TabNavigation = ({ dashboards, activeDashboard, tabs, activeTab, onNavigation, isCollapsed }) => {
  // Track expanded state for dashboards
  const [expandedDashboards, setExpandedDashboards] = useState({});
  
  // Toggle dashboard expansion
  const toggleDashboard = (dashboardId) => {
    setExpandedDashboards(prev => ({
      ...prev,
      [dashboardId]: !prev[dashboardId]
    }));
  };
  
  // Determine if a dashboard should be expanded
  const isDashboardExpanded = (dashboardId) => {
    // If explicitly set in state, use that value
    if (expandedDashboards[dashboardId] !== undefined) {
      return expandedDashboards[dashboardId];
    }
    // Otherwise, expand if it's the active dashboard
    return dashboardId === activeDashboard;
  };
  
  // Get the first tab ID for a dashboard
  const getFirstTabId = (dashboard) => {
    if (dashboard.tabs && dashboard.tabs.length > 0) {
      return dashboard.tabs[0].id;
    }
    return '';
  };
  
  // If collapsed, show only icons or abbreviated view
  if (isCollapsed) {
    return (
      <div className="tab-navigation collapsed">
        <ul className="dashboard-list">
          {dashboards.map(dashboard => (
            <li key={dashboard.id} className="dashboard-item">
              <div 
                className={`dashboard-header icon-only ${activeDashboard === dashboard.id ? 'active' : ''}`}
                onClick={() => {
                  // For all dashboards, navigate to first tab
                  const firstTabId = getFirstTabId(dashboard);
                  if (firstTabId) {
                    onNavigation(dashboard.id, firstTabId);
                  }
                }}
                title={dashboard.name}
              >
                <span className="dashboard-icon">{dashboard.name.charAt(0)}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Normal expanded view
  return (
    <div className="tab-navigation">
      <ul className="dashboard-list">
        {dashboards.map(dashboard => {
          // Get the first tab for this dashboard
          const firstTabId = getFirstTabId(dashboard);
          
          // Check if this is a dashboard with no tabs UI
          const isTablessDashboard = dashboard.hasDefaultTab === true;
          
          return (
            <li key={dashboard.id} className="dashboard-item">
              <div 
                className={`dashboard-header ${activeDashboard === dashboard.id ? 'active' : ''}`}
                onClick={() => {
                  // Handle dashboard click
                  if (isTablessDashboard) {
                    // For tabless dashboards, navigate directly to first tab
                    if (firstTabId) {
                      onNavigation(dashboard.id, firstTabId);
                    }
                  } else {
                    // For regular dashboards, toggle expansion
                    toggleDashboard(dashboard.id);
                    
                    // On mobile, also navigate to the first tab if clicking on an inactive dashboard
                    const isMobile = window.innerWidth <= 768;
                    if (isMobile && dashboard.id !== activeDashboard && firstTabId) {
                      onNavigation(dashboard.id, firstTabId);
                    }
                  }
                }}
              >
                <span className="dashboard-name">{dashboard.name}</span>
                {/* Only show expand icon for dashboards with tabs */}
                {!isTablessDashboard && (
                  <span className="expand-icon">{isDashboardExpanded(dashboard.id) ? '▼' : '▶'}</span>
                )}
              </div>
              
              {/* Only show tab list for dashboards with tabs and when expanded */}
              {!isTablessDashboard && isDashboardExpanded(dashboard.id) && (
                <ul className="tab-list">
                  {dashboard.tabs && dashboard.tabs.map(tab => (
                    <li 
                      key={tab.id} 
                      className={`tab-item ${activeDashboard === dashboard.id && activeTab === tab.id ? 'active' : ''}`}
                      onClick={() => onNavigation(dashboard.id, tab.id)}
                    >
                      {tab.name}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TabNavigation;