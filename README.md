Iv'e started this project to learn nextjs's new app router (extensive experience with pages router), golang (completely new) and docker (somewhat new).
Additionaly I wanted to experiment with real world production-ready app's problems such as setting up dev environment with docker including hot module reloading, mounting & persisting data on local disk and setting up docker secrets.

as the project progressed Iv'e also experimented with AWS and Jenkins. I'm using AWS EC2 for my application runner as well as to host my Jenkins CI/CD pipeline. I'm also using AWS ECR (container registry) to host my application's services' images.
for my Jenkins CI/CD pipeline I'm building the project via docker, pushing the images to the ECR and then SSH'ing to my EC2 machine as well as pulling and running the latest images. In a real world project I'd seperate between the frontend and the
backend codebase (also for better deployment times) but I've decided to keep things simple in this adventure to learn new technologies.
