# Civic-Issue-Reporting-System


Problem Statement
	Urban civic issues such as potholes, garbage accumulation, water leakage, faulty streetlights, and
	drainage problems are often reported through inefficient manual systems. These systems lack
	transparency, timely resolution, and proper tracking. A smart, centralized digital platform is required
	to improve reporting and resolution.
Objectives
	• Develop a web-based civic issue reporting platform
	• Allow users to upload images, descriptions, and locations
	• Automatically classify reported issues using Machine Learning
	• Enable administrators to assign issues to relevant authorities
	• Provide real-time issue status updates to users
System Overview
	• Users submit civic issues with image and location data
	• Backend processes and stores issue details securely
	• Admin assigns issues to appropriate departments
	• Users receive updates until issue resolution

Technology Stack
	• Frontend: React.js, HTML, CSS
	• Backend: Django (Python), REST APIs
	• Database:  SQLite 

System Architecture
	• Client-server architecture
	• Frontend communicates with backend via REST APIs
	• Backend handles authentication, issue management
	• Database stores user data, issues, and status updates

Machine Learning Module
	• Hybrid ML approach using image and text data
	• Image classification using MobileNetV2 (Transfer Learning)
	• Text classification using TF-IDF and Logistic Regression
	• Final issue category decided using weighted prediction scores


Datasets Used
	• Pothole images dataset collected from Kaggle
	• Garbage and waste management image datasets from public sources
	• Water leakage and drainage issue images from open datasets
	• Manually collected images for streetlight and drainage issues
	• Synthetic and user-generated text descriptions for NLP training

CNN predicts classes such as:
	Pothole
	Garbage
	Water Leakage
	Drainage Problem
	Faulty Streetlight

AI-Based Priority Assessment
	• Priority determined based on issue category
	• Critical issues like water leakage and drainage given higher priority
	• Location-based impact considered for priority scoring
	• Helps authorities resolve urgent issues faster
	• Improves efficient allocation of civic resources
