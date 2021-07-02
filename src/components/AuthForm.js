import React, { useRef, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import firebase from 'firebase';
import 'firebase/auth';
import firebaseConfig from '../utils/firebaseConfig';
import OtpInput from 'react-otp-input';
import IntlTelInput from 'react-intl-tel-input';
import 'react-intl-tel-input/dist/main.css';
import strings from './strings';
import './styles.css';

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const AuthForm = () => {
  const captchaRef = useRef(null);
  const history = useHistory();
  const [code, setCode] = useState(null);
  const [codeFieldEnabled, enableCodeField] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      'recaptcha-container',
      {
        size: 'invisible',
        callback: function () {
          onFinish();
        },
      },
    );
  });

  const onFinish = () => {
    var appVerifier = window.recaptchaVerifier;
    app
      .auth()
      .signInWithPhoneNumber('+16505551234', appVerifier)
      .then(function (confirmation) {
        setConfirmation(confirmation);
        enableCodeField(true);
      })
      .catch(function (error) {
        console.log('error2->', error);
      });
  };

  function confirmCode() {
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
  }

  return (
    <div>
      <h2>Test phone auth form with recaptcha</h2>
      <div className="inputContainer">
        <label>Phone number</label>
        <IntlTelInput preferredCountries={['us']} />
        <button onClick={onFinish}>{strings.sendCode}</button>
      </div>
      {codeFieldEnabled && (
        <div>
          <div className="inputContainer">
            <label>Confirmation code</label>
            <OtpInput value={code} onChange={setCode} numInputs={6} />
            <button onClick={confirmCode}>{strings.confirm}</button>
          </div>
          <p>{error}</p>
        </div>
      )}
      <div id="recaptcha-container" ref={captchaRef}></div>
    </div>
  );
};

AuthForm.propTypes = {};

export default AuthForm;
