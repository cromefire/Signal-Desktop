// Copyright 2019-2021 Signal Messenger, LLC
// SPDX-License-Identifier: AGPL-3.0-only

import { connect } from 'react-redux';
import { mapDispatchToProps } from '../actions';
import { TypingBubble } from '../../components/conversation/TypingBubble';
import { strictAssert } from '../../util/assert';
import type { StateType } from '../reducer';

import { getIntl, getTheme } from '../selectors/user';
import { getConversationSelector } from '../selectors/conversations';
import { getPreferredBadgeSelector } from '../selectors/badges';

type ExternalProps = {
  id: string;
};

const mapStateToProps = (state: StateType, props: ExternalProps) => {
  const { id } = props;

  const conversation = getConversationSelector(state)(id);
  if (!conversation) {
    throw new Error(`Did not find conversation ${id} in state!`);
  }

  const { typingContact } = conversation;
  strictAssert(typingContact, 'Missing typingContact');

  return {
    ...typingContact,
    // This `|| []` is probably unnecessarily defensive. This should only affect v5.24.
    badge: getPreferredBadgeSelector(state)(typingContact.badges || []),
    conversationType: conversation.type,
    i18n: getIntl(state),
    theme: getTheme(state),
  };
};

const smart = connect(mapStateToProps, mapDispatchToProps);

export const SmartTypingBubble = smart(TypingBubble);
