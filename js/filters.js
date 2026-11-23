// THE FILTER MENUS on the Projects page: which industries, approaches and tools exist, and how they are grouped.
// When a new project uses a method or tool that is not listed here, add it to the right group so it can be filtered.
const filterConfig = {
  industry: {
    element: document.getElementById("industryFilter"),
    allLabel: {en:"All industries",de:"Alle Branchen"},
    groups: [
      {name:"Automotive",items:[]},
      {name:"Finance",items:[]},
      {name:"Logistics",items:[]},
      {name:"Public Sector",items:[]},
      {name:"Retail & Consumer",items:[]}
    ],
    // specific terms: shown only on project cards and detail pages, matched by the filter above
    details: {"Finance":["M&A"],"Logistics":["Parcel Operations","Logistics Strategy"]}
  },
  method: {
    element: document.getElementById("methodFilter"),
    allLabel: {en:"All approaches",de:"Alle Ansätze"},
    groups: [
      {name:"Descriptive Analytics",items:["Data Cleaning","Descriptive Statistics","EDA","Process Mining"]},
      {name:"Diagnostic Analytics",items:["A/B Testing","Hypothesis Testing"]},
      {name:"Predictive Analytics",items:["Machine Learning","Regression Analysis","Time Series Forecasting"]},
      {name:"Prescriptive Analytics",items:["Deep Reinforcement Learning","Optimization","Simulation"]},
      {name:"Strategic Analysis",items:["PESTEL Analysis","Scenario Planning","Trend Analysis"]}
    ],
    details: {
      "A/B Testing":["Control Group Analysis"],
      "Process Mining":["Process Discovery","Conformance Checking","Performance Analysis"],
      "Machine Learning":["Classification","Decision Tree","Random Forest","XGBoost","Neural Networks","Logistic Regression","Feature Engineering","Hyperparameter Tuning"],
      "Regression Analysis":["OLS"],
      "Time Series Forecasting":["Exponential Smoothing","STL Decomposition"],
      "Deep Reinforcement Learning":["DQN","PPO","Reward Design"],
      "Optimization":["Greedy Heuristic","Multi-Objective Optimization"]
    }
  },
  software: {
    element: document.getElementById("softwareFilter"),
    allLabel: {en:"All tools",de:"Alle Tools"},
    groups: [
      {name:"Python",items:[]},
      {name:"R",items:[]},
      {name:"SQL",items:[]},
      {name:"Excel",items:[]},
      {name:"Stata",items:[]},
      {name:"Software & Platforms",items:["CARLA","Disco","Meta Horizon Worlds"]}
    ],
    details: {
      "Python":["Pandas","NumPy","SciPy","Scikit-learn","PM4Py","TensorFlow","XGBoost","Optuna","Gym","Stable-Baselines3"],
      "R":["forecast","tidyverse","ggplot2","dplyr","tidymodels"]
    }
  }
};
