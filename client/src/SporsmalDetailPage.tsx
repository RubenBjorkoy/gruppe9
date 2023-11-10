import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Component } from 'react-simplified';
import { Card, Row, Column, Form, Button, NavBar } from './widgets';
import sporsmalService, { Sporsmal } from './sporsmal-service';
import TagService, { Tag } from './tag-service';
import favorittService, { Favoritt } from './favoritt-service';
import { NavLink } from 'react-router-dom';
import { HashRouter, Route } from 'react-router-dom';


