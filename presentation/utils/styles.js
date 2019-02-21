import { StyleSheet } from 'react-native';

const colors = {
  red: '#f4511e',
  gray: '#555555',
  lightGray: '#a0a0a0',
  lighterGray: '#f1efef',
  white: '#fafafa',
  black: '#000000',
  yellow: '#fffedf',
};

const defaultStyles = StyleSheet.create({
  test: {
    backgroundColor: 'blue',
    color: 'white',
  },
  fullHeight: {
    flex: 1,
    flexDirection: 'column',
  },
  fullWidth: {
    flex: 1,
    flexDirection: 'row',
  },
  fill: {
    flex: 1,
  },
  column: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  listItem: {
    padding: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItemTitle: {
    fontSize: 20,
    color: colors.gray,
  },
  listItemSubtitle: {
    fontSize: 16,
    color: colors.lightGray,
  },
  menuButton: {
    width: 26,
    height: 26,
  },
  button: {
    backgroundColor: colors.red,
    color: colors.white,
    paddingVertical: 3,
    paddingHorizontal: 10,
    textAlign: 'center',
    marginHorizontal: 10
  },
  navigationButton: {
    backgroundColor: colors.red,
    color: colors.white,
    height: 26,
    minWidth: 26,
  },
  currency: {
    width: 102,
    textAlign: 'right',
  },
  horizontalMargins: {
    marginHorizontal: 8,
  },
  textInput: {
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    marginHorizontal: 10,
    fontSize: 18,
  },
  verticalMargin: {
    marginVertical: 10,
  },
  horizontalMargin: {
    marginHorizontal: 10,
  },
  marginBottom: {
    marginBottom: 10,
  },
  marginTop: {
    marginTop: 10,
  },
  marginLeft: {
    marginLeft: 10,
  },
  lessRelevant: {
    fontSize: 12,
    color: colors.lightGray,
  },
  footer: {
    borderTopColor: colors.lightGray,
    borderTopWidth: 1,
    backgroundColor: colors.lighterGray,
    height: 70,
    justifyContent: 'center',
    padding: 12,
  },
  center: {
    justifyContent: 'center',
    textAlign: 'center',
  },
  error: {
    marginLeft: 10,
    paddingLeft: 8,
    marginRight: 10,
    paddingRight: 8,
    borderColor: colors.red,
    borderWidth: 1,
    borderStyle: 'dashed',
    backgroundColor: colors.yellow,
    color: colors.red,
  },
  modal: {
    backgroundColor: 'white',
    margin: 0, // This is the important style you need to set
    alignItems: undefined,
    justifyContent: undefined,
  }
});

export { defaultStyles, colors };
