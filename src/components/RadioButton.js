// // Importing Section
// import React from "react";
// import styled from "styled-components";

// // Styling Section
// const Wrapper = styled.div`
//   @keyframes click-wave {
//     0% {
//       height: 40px;
//       width: 40px;
//       opacity: 0.35;
//       position: relative;
//     }
//     100% {
//       height: 200px;
//       width: 200px;
//       margin-left: -80px;
//       margin-top: -80px;
//       opacity: 0;
//     }
//   }

//   .option-input {
//     appearance: none;
//     position: relative;
//     top: 13.33333px;
//     right: 0;
//     bottom: 0;
//     left: 0;
//     height: 40px;
//     width: 40px;
//     transition: all 0.15s ease-out 0s;
//     background: #cbd1d8;
//     border: none;
//     color: #fff;
//     cursor: pointer;
//     display: inline-block;
//     margin-right: 0.5rem;
//     outline: none;
//     position: relative;
//     z-index: 1000;
//   }

//   .option-input:hover {
//     background: #9faab7;
//   }

//   .option-input:checked {
//     background: #40e0d0;
//   }

//   .option-input:checked::before {
//     height: 40px;
//     width: 40px;
//     position: absolute;
//     content: "✔";
//     display: inline-block;
//     font-size: 26.66667px;
//     text-align: center;
//     line-height: 40px;
//   }

//   .option-input:checked::after {
//     -webkit-animation: click-wave 0.65s;
//     -moz-animation: click-wave 0.65s;
//     animation: click-wave 0.65s;
//     background: #40e0d0;
//     content: "";
//     display: block;
//     position: relative;
//     z-index: 100;
//   }

//   .option-input.radio {
//     border-radius: 50%;
//   }

//   .option-input.radio::after {
//     border-radius: 50%;
//   }
// `

// // Rendering Section
// const RadioButton = props => (
//   <Wrapper>
//     <label>
//       <input type="radio" className="option-input radio" name="example" checked />3 ROUNDS
//     </label>
//     <label>
//       <input type="radio" className="option-input radio" name="example" />5 ROUNDS
//     </label>
//     <label>
//       <input type="radio" className="option-input radio" name="example" />8 ROUNDS
//     </label>
//   </Wrapper>
// );

// export default RadioButton;
