#FROM ubuntu
#RUN apt-get update
#RUN apt-get install -y git nodejs npm
#RUN git clone git://github.com/DuoSoftware/DVP-CampaignManager.git /usr/local/src/campaignmanager
#RUN cd /usr/local/src/campaignmanager; npm install
#CMD ["nodejs", "/usr/local/src/campaignmanager/app.js"]

#EXPOSE 8827

# FROM node:9.9.0
# ARG VERSION_TAG
# RUN git clone -b $VERSION_TAG https://github.com/DuoSoftware/DVP-CampaignManager.git /usr/local/src/campaignmanager
# RUN cd /usr/local/src/campaignmanager;
# WORKDIR /usr/local/src/campaignmanager
# RUN npm install
# EXPOSE 8827
# CMD [ "node", "/usr/local/src/campaignmanager/app.js" ]

FROM node:10-alpine
WORKDIR /usr/local/src/campaignmanager
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8827
CMD [ "node", "app.js" ]