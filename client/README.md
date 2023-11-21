# Project Name

Brief description or tagline for your project.

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

## Usage

The user first comes to the Forum page where the questions are shown in order of sporsmalid.
The user can then filter the unanswered questions or sort according to number of viewings or last changed.

The user can use the buttons to come into the question details. 
Here the user can comment on, edit or delete the given question.  

In addition to the question, the user is presented with the answers to the question, or the user can create a new answer.
Answers can be commented on, edited or deleted. The user may mark the answer as a favorite, vote up or down the answer.  The answers can be sorted based on votes (poeng) or after last changed.  
Comments can be changed or deleted.  

Nytt Spørsmal page allows the user to create a new question.  The question must contain a tag. A list of tags is presented. The user can add a new tag if the current tags do not cover their topic.

Favoritter lists the current favorite answers. 

Tagger lists the current tags in the database. Tags can either be created, edited or deleted. The user can also sort the tags based on the number of questions where the tag is referanced.
