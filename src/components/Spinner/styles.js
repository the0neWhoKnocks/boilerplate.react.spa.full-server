@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.spinner {
  text-align: center;
  padding: 0.5em 1em;
  border-radius: 0.3em;
  background: rgba(0,0,0,0.4);
  display: inline-block;

  &::before,
  &__icon {
    display: inline-block;
    vertical-align: middle;
  }

  &::before {
    content: attr(data-label);
    color: #fff;
    font-weight: bold;
    margin-right: 0.5em;
  }

  &__icon {
    width: 2em;
    height: 2em;
    border-radius: 100%;
    border: solid 0.3em rgba(255,255,255,0.25);
    border-top-color: #fff;
    animation: spin 0.5s linear infinite;
  }
}
