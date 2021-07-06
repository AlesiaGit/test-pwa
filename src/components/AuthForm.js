import React, { useRef, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  cfaSignIn,
  cfaSignInPhoneOnCodeSent,
} from 'capacitor-firebase-auth';
import firebase from 'firebase';
import 'firebase/auth';
import firebaseConfig from '../utils/firebaseConfig';
import OtpInput from 'react-otp-input';
import IntlTelInput from 'react-intl-tel-input';
import 'react-intl-tel-input/dist/main.css';
import { WEB_PLATFORM } from './constants';
import strings from './strings';
import './styles.css';
import { Capacitor } from '@capacitor/core';

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const AuthForm = () => {
  const captchaRef = useRef(null);
  const history = useHistory();
  const [code, setCode] = useState(null);
  const platform = Capacitor.getPlatform();
  const [codeFieldEnabled, enableCodeField] = useState(false);
  const [verificationId, setVerificationId] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (platform === WEB_PLATFORM) {
      window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
        'recaptcha-container',
        {
          size: 'invisible',
          callback: function () {
            webSignIn();
          },
        },
      );
    }
  });

  const webSignIn = () => {
    var appVerifier = window.recaptchaVerifier;
    app
      .auth()
      .signInWithPhoneNumber('+16505551234', appVerifier)
      .then(function (confirmation) {
        setConfirmation(confirmation);
        enableCodeField(true);
      })
      .catch(function (error) {
        setError(error);
      });
  };

  const nativeSignIn = () => {
    cfaSignIn('phone', {
      phone: '+16505551234',
    }).subscribe(
      () => {
        enableCodeField(true);
      },
      (error) => {
        setError(error);
      },
    );

    cfaSignInPhoneOnCodeSent().subscribe(
      (verificationId) => {
        setVerificationId(verificationId);
        enableCodeField(true);
      },
      (error) => {
        setError(error);
      },
    );
  };

  const sendCode = () => {
    if (WEB_PLATFORM === platform) {
      webSignIn();
    } else {
      nativeSignIn();
    }
  };

  const confirmCodeWeb = () => {
    confirmation
      .confirm(code)
      .then(function () {
        history.push({
          pathname: '/',
          state: { authorized: true },
        });
      })
      .catch(function (error) {
        setError(error?.message || 'something went wrong');
      });
  };

  function confirmCodeNative() {
    var credential = firebase.auth.PhoneAuthProvider.credential(
      verificationId,
      code,
    );
    app
      .auth()
      .signInWithCredential(credential)
      .then(function () {
        history.push({
          pathname: '/',
          state: { authorized: true },
        });
      })
      .catch(function (error) {
        setError(error?.message || 'something went wrong');
      });
  }

  const confirmCode = () => {
    if (WEB_PLATFORM === platform) {
      confirmCodeWeb();
    } else {
      confirmCodeNative();
    }
  };

  return (
    <div>
      <h2>Auth form with recaptcha</h2>
      <label>Phone number</label>
      <div className="inputContainer">
        <IntlTelInput preferredCountries={['us']} />
        <button onClick={sendCode}>{strings.sendCode}</button>
      </div>
      <p>Verification id: {verificationId}</p>
      {error && <p className="error">{`Error-> ${error}`}</p>}
      {codeFieldEnabled && (
        <div>
          <label>Confirmation code</label>
          <div className="inputContainer">
            <OtpInput value={code} onChange={setCode} numInputs={6} />
            <button onClick={confirmCode}>{strings.confirm}</button>
          </div>
        </div>
      )}
      <div id="recaptcha-container" ref={captchaRef}></div>
    </div>
  );
};

AuthForm.propTypes = {};

export default AuthForm;
