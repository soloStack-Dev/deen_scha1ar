import { useState } from '@lynx-js/react';

import './ProfileSheet.css';

import { pickDevicePhoto } from '../native/photo.js';

interface InputEvent {
  detail: { value: string };
}

interface ProfileSheetProps {
  userName: string;
  userEmail: string;
  avatar?: string;
  onClose: () => void;
  onUpdateAvatar: (avatar: string | null) => void;
  onSignOut: () => void;
  onDeleteAccount: () => void;
}

type Tab = 'profile' | 'settings';

const DELETE_PHRASE = 'delete my account';

export function ProfileSheet({
  userName,
  userEmail,
  avatar,
  onClose,
  onUpdateAvatar,
  onSignOut,
  onDeleteAccount,
}: ProfileSheetProps) {
  const [tab, setTab] = useState<Tab>('profile');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [phrase, setPhrase] = useState('');
  const [notice, setNotice] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const initial = userName.trim().slice(0, 1).toUpperCase() || 'U';
  const canDelete = phrase.trim().toLowerCase() === DELETE_PHRASE;

  async function choosePhoto() {
    'background only';
    setNotice('');
    const photo = await pickDevicePhoto();
    if (!photo) {
      setNotice('Device photo access is available once the native host is connected.');
      return;
    }
    onUpdateAvatar(photo);
    setNotice('Profile photo updated.');
  }

  function handlePhrase(event: InputEvent) {
    setPhrase(event.detail.value);
    setDeleteError('');
  }

  function confirmAccountDelete() {
    'background only';
    if (!canDelete) {
      setDeleteError(`Type "${DELETE_PHRASE}" exactly to continue.`);
      return;
    }
    onDeleteAccount();
  }

  return (
    <view className="sheet-backdrop">
      <view className="profile-sheet__dismiss" bindtap={onClose} />
      <view className="sheet-card sheet-card--tall profile-sheet">
        <view className="profile-sheet__head">
          <text className="sheet__title">Account</text>
          <view className="profile-sheet__close" bindtap={onClose}>
            <text className="profile-sheet__close-text">&#215;</text>
          </view>
        </view>

        <view className="profile-tabs">
          <view
            className={`profile-tab ${
              tab === 'profile' ? 'profile-tab--active' : ''
            }`}
            bindtap={() => setTab('profile')}
          >
            <text
              className={`profile-tab__label ${
                tab === 'profile' ? 'profile-tab__label--active' : ''
              }`}
            >
              Profile
            </text>
          </view>
          <view
            className={`profile-tab ${
              tab === 'settings' ? 'profile-tab--active' : ''
            }`}
            bindtap={() => setTab('settings')}
          >
            <text
              className={`profile-tab__label ${
                tab === 'settings' ? 'profile-tab__label--active' : ''
              }`}
            >
              Settings
            </text>
          </view>
        </view>

        {tab === 'profile' ? (
          <view className="profile-panel">
            <view className="profile-card">
              <view className="profile-card__avatar" bindtap={choosePhoto}>
                {avatar ? (
                  <image
                    className="profile-card__image"
                    src={avatar}
                    mode="aspectFill"
                  />
                ) : (
                  <text className="profile-card__initial">{initial}</text>
                )}
              </view>
              <text className="profile-card__name">{userName}</text>
              <text className="profile-card__email">{userEmail}</text>
              <text className="profile-card__hint">
                Tap the photo to use an image from this device.
              </text>
            </view>

            <text className="sheet__section-title">Account details</text>
            <view className="sheet__row">
              <text className="sheet__row-label">Username</text>
              <text className="sheet__row-action">{userName}</text>
            </view>
            <view className="sheet__row">
              <text className="sheet__row-label">Email</text>
              <text className="sheet__row-action">{userEmail}</text>
            </view>

            <view className="profile-photo-actions">
              <view
                className="button button--ghost profile-photo-actions__button"
                bindtap={choosePhoto}
              >
                <text className="button__label">
                  {avatar ? 'Change device photo' : 'Use device photo'}
                </text>
              </view>
              {avatar ? (
                <view
                  className="profile-photo-actions__reset"
                  bindtap={() => {
                    onUpdateAvatar(null);
                    setNotice('Using your initials again.');
                  }}
                >
                  <text className="profile-photo-actions__reset-text">Remove</text>
                </view>
              ) : null}
            </view>

            {notice ? <text className="profile-sheet__notice">{notice}</text> : null}

            <view
              className="button button--dark profile-sheet__wide"
              bindtap={onClose}
            >
              <text className="button__label button__label--light">Done</text>
            </view>
          </view>
        ) : (
          <view className="profile-panel">
            <text className="sheet__message">
              Your account is stored on this device. Logging out keeps the
              account so you can sign in again.
            </text>

            <text className="sheet__section-title">Session</text>
            <view className="profile-setting-row">
              <view className="profile-setting-row__copy">
                <text className="profile-setting-row__title">
                  Log out of this device
                </text>
                <text className="profile-setting-row__text">
                  Return to the authentication page.
                </text>
              </view>
              <view className="button button--ghost" bindtap={onSignOut}>
                <text className="button__label">Log out</text>
              </view>
            </view>

            <text className="sheet__section-title">Danger zone</text>
            {confirmDelete ? (
              <view className="profile-danger">
                <text className="profile-danger__title">Delete this account?</text>
                <text className="profile-danger__text">
                  This removes the account from this device and cannot be undone.
                </text>
                <text className="profile-danger__label">
                  Type <text className="profile-danger__phrase">{DELETE_PHRASE}</text> to confirm.
                </text>
                <input
                  className="profile-danger__input"
                  type="text"
                  default-value={phrase}
                  placeholder={DELETE_PHRASE}
                  maxlength={40}
                  bindinput={handlePhrase}
                />
                {deleteError ? (
                  <text className="profile-danger__error">{deleteError}</text>
                ) : null}
                <view className="profile-danger__actions">
                  <view
                    className="button button--ghost profile-danger__action"
                    bindtap={() => {
                      setConfirmDelete(false);
                      setPhrase('');
                      setDeleteError('');
                    }}
                  >
                    <text className="button__label">Cancel</text>
                  </view>
                  <view
                    className={`button button--danger profile-danger__action ${
                      canDelete ? '' : 'profile-danger__action--disabled'
                    }`}
                    bindtap={confirmAccountDelete}
                  >
                    <text className="button__label button__label--light">
                      Delete account
                    </text>
                  </view>
                </view>
              </view>
            ) : (
              <view className="profile-setting-row">
                <view className="profile-setting-row__copy">
                  <text className="profile-setting-row__title">Delete account</text>
                  <text className="profile-setting-row__text">
                    Permanently remove this account and sign out.
                  </text>
                </view>
                <view
                  className="button button--danger"
                  bindtap={() => {
                    setConfirmDelete(true);
                    setDeleteError('');
                  }}
                >
                  <text className="button__label button__label--light">
                    Delete
                  </text>
                </view>
              </view>
            )}
          </view>
        )}
      </view>
    </view>
  );
}
