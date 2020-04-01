import React from 'react';
import PropTypes from 'prop-types';

import { RowWithMargin, SummaryText, StyledLink } from '../../../Styles/search';

const StyledRow = RowWithMargin(5);

class CallSummary extends React.Component {
  static displayName = 'CallSummary';

  static propTypes = {
    callSummary: PropTypes.string.isRequired,
    onClickFull: PropTypes.func.isRequired,
  };

  state = {
    expanded: false,
  };

  shortSummary = (this.props.callSummary && this.props.callSummary.substr(0, 50)) || '- No call summary -';

  isLong = this.shortSummary.length === 50;

  handleClick = bool => event => {
    event.stopPropagation();
    this.setState({ expanded: bool });
  };

  render() {
    return this.state.expanded ? (
      <div>
        <SummaryText>{this.props.callSummary}</SummaryText>
        <StyledLink onClick={this.props.onClickFull}>See full record</StyledLink>
      </div>
    ) : (
      <StyledRow>
        <SummaryText>
          {this.shortSummary}
          {this.isLong && '...'}
        </SummaryText>
        {this.isLong && <StyledLink onClick={this.handleClick(true)}>more notes</StyledLink>}
      </StyledRow>
    );
  }
}

export default CallSummary;
