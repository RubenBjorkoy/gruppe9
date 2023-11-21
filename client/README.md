# Gruppe 9

## Table of Contents

- [Introduction](#introduction)
- [Components](#components)
- [Services](#services)
- [Installation](#installation)
- [Usage](#usage)

## Introduction

The project is a Q & A platform for Webutvikling H23 group 9.  
We were 3 members involved in the group:
* Aaron Miille
* Ahmed Nawab
* Ruben Bjørkøy


## Components

Components are divided up to create more easily readable code.  Components have some cross dependancies with other components.

## Services

Services handle interaction with the server for the proper retrieval of data. This involves retrieving of one, all, creating, updating, or deleting from the database.

## Installation

Install dependencies and bundle client files:

```sh
cd client
npm install
npm start
```
Run tests for client:

```sh
cd client
npm install
npm test
```
## Guide for Using Q-A Platform 

The front page of the platform shows by default all the existing questions. At the top of the page, you will see 4 pages next to “Forum”. Forum and Spørsmål redirect to the same path, showing the list of all question on the page. 

Spørsmål – This page will show all questions on the forum. From left to right a question has the following properties:
A question id.
Title.
The question text.
Number of views. (Points)
Date of creation.
Date of last edit.
Button for viewing more details about the questions, as well as potential answers and comments.

When clicking Til Spørsmål –
You will view the question in a bigger form as well as viewing some additional properties of the question. These details include what was marked as the best answer of this question and which tags this question belongs to. In addition to this, you will be able to delete the question by clicking the “Slett” button, as well as edit the question. 


When clicking “Rediger”
You will be able to change the title, text and tags of the question. In addition to this you will be able to add a new tag to the list of tags if you desire to do so.

Til Spørsmål Continued –
Under the question you will see a form for creating comments to the question. Comments can be voted up and down, as well as deleted and edited. The points property which comments have is not linked to the number of views it has, rather the amount of votes it has gotten. When scrolling through all the comments you will be greeted with a form to create a new reply. A reply can be marked as a favorite so you can view it under the favorite’s menu. It also can be voted up and down, which means that the point system is also based on points, not views. Lastly, an answer can be marked as the best answer for this question. Replies can also be edited and deleted as comments can be. In addition to this, you will be able to reply to replies, making a comment. These comments have the same properties as the comments which is a reply to the question. 



Nytt spørsmål – when clicking this you will be sent to a new page where you can fill in a form to submit a new question. All fields (title, text, and tag) are mandatory. If any of the tags which are available by default do not suit your question, feel free to make a new tag using the form shown on the page. 

Favoritter – This page gives you a list of all favorite answers to questions,

Tagger – This page gives you a list of all the different tags which have been created. You can either sort the tags by how many questions they have received or by searching for the name of a tag.



