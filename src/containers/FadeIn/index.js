import React from 'react';
import classnames from 'classnames';
import TrackVisibility from 'react-on-screen';
import 'animate.css';

const TrackedComponent = props => {
  const visibilityClasses = props.isVisible
    ? classnames({
        animated: true,
        [props.action]: true
      })
    : classnames({});

  const visibilityStyles = !props.isVisible
    ? {
        visibility: 'hidden'
      }
    : {};

  return (
    <React.Fragment>
      {React.cloneElement(props.children, {
        ...props,
        visibilityClasses,
        visibilityStyles
      })}
    </React.Fragment>
  );
};

const FadeIn = props => (
  <TrackVisibility partialVisibility once>
    <TrackedComponent {...props} />
  </TrackVisibility>
);

export default FadeIn;
