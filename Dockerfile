FROM ubuntu
RUN apt-get update
RUN apt-get install -y git nodejs npm
RUN git clone git://github.com/DuoSoftware/DVP-CampaignManager.git /usr/local/src/campaignmanager
RUN cd /usr/local/src/campaignmanager; npm install
CMD ["nodejs", "/usr/local/src/campaignmanager/app.js"]

EXPOSE 8827