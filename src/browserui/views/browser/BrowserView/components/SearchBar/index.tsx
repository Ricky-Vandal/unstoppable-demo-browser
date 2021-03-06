import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { StyledSearchBox, InputContainer, SearchIcon, Input, StyledSearchBar, Form } from './style';
import { NavigationButtons } from '~/browserui/views/browser/BrowserView/components/NavigationButtons';
import { BrowserSession } from '~/browserui/models/browser-session';
import { ToolbarButton } from '../ToolbarButton';
import { icons } from '~/browserui/resources/constants';
import { ipcRenderer } from 'electron';
import { BrowserState } from '~/browserui/models/tab';

let currentSession: BrowserSession = null;

const handleUrlBarChange = (event: any) => {
  if (currentSession.selectedTab) {
    currentSession.selectedTab.urlBarValue = event.target.value;
  }
}

const handleUrlSubmit = (event: any) => {
  event.preventDefault();
  var url = currentSession.selectedTab.urlBarValue;

  currentSession.selectedTab.setUrl(url);
}

const handleBookmarksButtonClick = (event: any) => {
  currentSession.selectedTab.setUrl('bookmarks');
}

const handleAddBookmark = (event: any) => {
  currentSession.bookmarks.pendingTitle = currentSession.selectedTab.title;
  currentSession.bookmarks.pendingUrl = currentSession.selectedTab.urlBarValue;
  currentSession.selectedTab.browserState = BrowserState.AddBookmark;
}

const AutoUpdateButton = () => {
  if (currentSession.updateAvailable) {
    return (
      <ToolbarButton
        size={20}
        tooltip='A new update is ready!'
        icon={icons.download}
        onClick={handleUpdateClick} />
    )
  } else {
    return (
      <span></span>
    )
  }
}

const SettingsButton = () => {
  return (
    <ToolbarButton
      size={20}
      icon={icons.settings}
      onClick={handleSettingsClick} />
  )
}

const AddBookmarkButton = (props: any) => {
  if (props.bookmarkable) {
    return (
      <ToolbarButton
        size={20}
        icon={icons.add}
        onClick={handleAddBookmark}
      />
    )
  }else{
    return (
      <span></span>
    )
  }
}

const handleReportClick = () => {
  currentSession.selectedTab.setUrl('https://unstoppabledomains.com/report');
}

const BookmarksButton = () => {
  return (
    <ToolbarButton
      size={20}
      icon={icons.bookmarks}
      onClick={handleBookmarksButtonClick}
    />
  )
}

const ReportButton = (props: any) => {
  if (props.reportable) {
    return (
      <ToolbarButton
        size={20}
        icon={icons.alert}
        onClick={handleReportClick}
      />
    )
  } else {
    return (
      <span></span>
    )
  }
}

const handleUpdateClick = () => {
  ipcRenderer.send('update-reaquested');
}

const handleSettingsClick = () => {
  //Open settings page.
  currentSession.selectedTab.setUrl('settings');
}

export const SearchBox = observer(({ browserSession }: { browserSession: BrowserSession }) => {
  currentSession = browserSession;

  return (
    <StyledSearchBar>
      <NavigationButtons browserSession={browserSession} />
      <StyledSearchBox >
        <InputContainer>
          <SearchIcon />
          <Form onSubmit={handleUrlSubmit}>
            <Input
              type="text"
              autoFocus
              placeholder="Search or type in URL"
              value={browserSession.currentUrlBarValue}
              onChange={handleUrlBarChange}
            />
          </Form>
          <AddBookmarkButton bookmarkable={browserSession.selectedTab.bookmarkable} />
        </InputContainer>
      </StyledSearchBox>
      <AutoUpdateButton />
      <ReportButton reportable={browserSession.selectedTab.reportable} />
      <BookmarksButton />
      <SettingsButton />
    </StyledSearchBar>
  );
});