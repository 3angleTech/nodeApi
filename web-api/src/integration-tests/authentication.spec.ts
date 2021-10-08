/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * @license
 * Copyright (c) 2018 THREEANGLE SOFTWARE SOLUTIONS SRL
 * Available under MIT license webApi/LICENSE
 */
import * as chai from 'chai';
import { assert, expect } from 'chai';
import chaiHttp = require('chai-http');
import * as HttpStatus from 'http-status-codes';

import { appFactory } from '../app';

chai.use(chaiHttp);
const agent: ChaiHttp.Agent = chai.request.agent(appFactory());

const username = 'ionut';
const password = 'qW12!@';
const clientId = '3at-api';
const clientSecret = '5r5rd15c650f4849119eb894939d9fdaaf5f7d0e7e0f65de15b71bfa6411011y';

describe('Authentication tests', () => {
  it('Should not be able to log in with invalid credentials', (done) => {
    agent.post('/api/v1/auth/token')
      .send(`username=${username}&password=invalid_password&client_id=${clientId}&client_secret=${clientSecret}&grant_type=password`)
      .end((err, res) => {
        assert.isNull(err);
        expect(res.body.message).to.equal('Invalid username or password');
        expect(res).to.have.status(HttpStatus.INTERNAL_SERVER_ERROR);
        done(err);
      });
  });
  it('Should get access and refresh tokens when logged in successfully', (done) => {
    agent.post('/api/v1/auth/token')
      .send(`username=${username}&password=${password}&client_id=${clientId}&client_secret=${clientSecret}&grant_type=password`)
      .end((err, res) => {
        assert.isNull(err);
        assert.isNotNull(res.body.accessToken);
        assert.isNotNull(res.body.refreshToken);
        expect(res).to.have.status(HttpStatus.OK);
        expect(res, 'accessToken cookie not found').to.have.cookie('accessToken');
        done(err);
      });
  });
  it('Should get account details', (done) => {
    agent.get('/api/v1/account/me')
      .end((err, res) => {
        assert.isNull(err);
        expect(res.body.username).to.equal(username);
        expect(res).to.have.status(HttpStatus.OK);
        done(err);
      });
  });
  it('Should log out', (done) => {
    agent.get('/api/v1/auth/logout')
      .end((err, res) => {
        assert.isNull(err);
        expect(res.body.message).to.equal('Logged out successfully');
        expect(res).to.have.status(HttpStatus.OK);
        done(err);
      });
  });
  it('Should get HTTP unauthorized when getting the account after logged out', (done) => {
    agent.get('/api/v1/account/me')
      .end((err, res) => {
        assert.isNull(err);
        expect(res).to.have.status(HttpStatus.UNAUTHORIZED);
        done(err);
      });
  });
});
