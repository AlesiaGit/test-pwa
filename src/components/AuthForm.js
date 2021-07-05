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
  const [verificationId, setVerificationId] = useState(null);
  // const [confirmation, setConfirmation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // //react.js implementation
    // window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
    //   'recaptcha-container',
    //   {
    //     size: 'invisible',
    //     callback: function () {
    //       onFinish();
    //     },
    //   },
    // );

    console.log('verification Id->', verificationId);
  });

  const sendCode = () => {
    cfaSignIn('phone', { phone: '+16505551234' }).subscribe(
      (user) => {
        console.log(user.phoneNumber);
        enableCodeField(true);
      },
    );
    cfaSignInPhoneOnCodeSent().subscribe(async (verificationId) => {
      console.log('cfaSignInPhoneOnCodeSent');
      setVerificationId(verificationId);
      console.log(verificationId);
      enableCodeField(true);
    });

    // //react.js implementation
    // var appVerifier = window.recaptchaVerifier;
    // app
    //   .auth()
    //   .signInWithPhoneNumber('+16505551234', appVerifier)
    //   .then(function (confirmation) {
    //     setConfirmation(confirmation);
    //     enableCodeField(true);
    //   })
    //   .catch(function (error) {
    //     console.log('error2->', error);
    //   });
  };

  function confirmCode() {
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

    // //react.js implementation
    // confirmation
    //   .confirm(code)
    //   .then(function () {
    //     history.push({
    //       pathname: '/',
    //       state: { authorized: true },
    //     });
    //   })
    //   .catch(function (error) {
    //     setError(error?.message || 'something went wrong');
    //   });
  }

  return (
    <div>
      <h2>Auth form with recaptcha</h2>
      <label>Phone number</label>
      <div className="inputContainer">
        <IntlTelInput preferredCountries={['us']} />
        <button onClick={sendCode}>{strings.sendCode}</button>
      </div>
      <p>Verification id: {verificationId}</p>
      {codeFieldEnabled && (
        <div>
          <label>Confirmation code</label>
          <div className="inputContainer">
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
