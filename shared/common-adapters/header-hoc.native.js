// @flow
import * as React from 'react'
import Text from './text'
import {StyleSheet} from 'react-native'
import BackButton from './back-button'
import Badge from './badge'
import Box from './box'
import FloatingMenu from './floating-menu'
import Icon from './icon'
import * as Styles from '../styles'
import type {Props} from './header-hoc.types'

const MAX_RIGHT_ACTIONS = 3
type State = {|
  floatingMenuVisible: boolean,
|}
export class HeaderHocHeader extends React.Component<Props, State> {
  state = {
    floatingMenuVisible: false,
  }
  _onHidden = () => this.setState({floatingMenuVisible: false})
  _showFloatingMenu = () => this.setState({floatingMenuVisible: true})
  render() {
    return (
      <Box style={Styles.collapseStyles([styles.header, this.props.theme === 'dark' ? styles.headerDark : styles.headerLight, this.props.headerStyle])}>
        {this.props.customComponent}
        {this.props.onCancel && (
          <Box style={styles.leftAction}>
            <Text type="BodyBigLink" style={styles.action} onClick={this.props.onCancel}>
              {this.props.customCancelText || 'Cancel'}
            </Text>
          </Box>
        )}
        {this.props.onBack && (
          <Box style={styles.leftAction}>
            <BackButton
              hideBackLabel={this.props.hideBackLabel}
              iconColor={this.props.theme === 'dark' ? Styles.globalColors.white : Styles.globalColors.black_40}
              style={styles.action}
              onClick={this.props.onBack}
            />
            {!!this.props.badgeNumber && <Badge badgeNumber={this.props.badgeNumber} />}
          </Box>
        )}
        {!!this.props.title && (
          <Box style={styles.titleContainer}>
            <Text type="BodySemibold" style={styles.title} lineClamp={1}>!{this.props.title}</Text>
          </Box>
        )}
        <Box style={Styles.collapseStyles([styles.rightActions, this.props.rightActions && styles.rightActionsPadding])}>
          {this.props.rightActions && this.props.rightActions.filter(Boolean).slice(0, this.props.rightActions && this.props.rightActions.length <= MAX_RIGHT_ACTIONS ? MAX_RIGHT_ACTIONS : MAX_RIGHT_ACTIONS - 1).map((action, item) => (
            action.custom
              ? <Box style={styles.action}>
                {action.custom}
                </Box>
              : action.icon
                ? <Icon
                    fontSize={22}
                    onClick={action.onPress}
                    style={styles.action}
                    type={action.icon}
                  />
                : <Text
                    type="BodyBigLink"
                    style={Styles.collapseStyles([styles.action, action.onPress && styles.actionPressed])}
                    onClick={action.onPress}
                  >
                    {action.label}
                  </Text>
          ))}
          {this.props.rightActions && this.props.rightActions.length > MAX_RIGHT_ACTIONS && (
            <>
              <Icon
                fontSize={22}
                onClick={this._showFloatingMenu}
                style={styles.action}
                type="iconfont-ellipsis"
              />
              <FloatingMenu
                visible={this.state.floatingMenuVisible}
                items={this.props.rightActions.filter(Boolean).slice(MAX_RIGHT_ACTIONS - 1).map((action, item) => ({
                  onClick: action.onPress,
                  title: action.label,
                }))}
                onHidden={this._onHidden}
                position="bottom left"
                closeOnSelect={true}
              />
            </>
          )}
        </Box>
      </Box>
    )
  }
}

function HeaderHoc<P: {}>(WrappedComponent: React.ComponentType<P>) {
  const HeaderHocWrapper = (props: P & Props) => (
    <Box style={styles.container}>
      <HeaderHocHeader {...props} />
      <Box style={styles.wrapper}>
        <Box style={styles.innerWrapper}>
          <WrappedComponent {...(props: P)} />
        </Box>
      </Box>
    </Box>
  )

  return HeaderHocWrapper
}

const styles = Styles.styleSheetCreate({
  action: {
    opacity: 1,
    paddingBottom: Styles.globalMargins.tiny,
    paddingLeft: Styles.globalMargins.tiny,
    paddingRight: Styles.globalMargins.tiny,
    paddingTop: Styles.globalMargins.tiny,
  },
  actionPressed: {
    opacity: 0.3,
  },
  container: {
    ...Styles.globalStyles.flexBoxColumn,
    height: '100%',
    position: 'relative',
    width: '100%',
  },
  header: {
    ...Styles.globalStyles.flexBoxRow,
    alignItems: 'center',
    borderBottomColor: Styles.globalColors.black_10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: 'flex-start',
    minHeight: Styles.globalMargins.xlarge - Styles.statusBarHeight,
    width: '100%',
  },
  headerDark: {
    backgroundColor: Styles.globalColors.darkBlue3,
  },
  headerLight: {
    backgroundColor: Styles.globalColors.white,
  },
  innerWrapper: {
    ...Styles.globalStyles.fillAbsolute,
  },
  leftAction: {
    ...Styles.globalStyles.flexBoxRow,
    alignItems: 'flex-start',
    flex: 1,
    justifyContent: 'flex-start',
  },
  rightActions: {
    ...Styles.globalStyles.flexBoxRow,
    alignItems: 'flex-end',
    flex: 1,
    justifyContent: 'flex-end',
  },
  rightActionsPadding: {
    paddingRight: Styles.globalMargins.tiny,
  },
  title: {
    color: Styles.globalColors.black_75,
  },
  titleContainer: {
    ...Styles.globalStyles.flexBoxRow,
    alignItems: 'center',
    flex: 1,
    flexShrink: 1,
    justifyContent: 'center',
    width: '100%',
  },
  wrapper: {
    flexGrow: 1,
  },
})

export default HeaderHoc
