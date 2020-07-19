import style9 from 'style9-theme.macro';

const styles = style9.create({
  styles: {
    fontSize: [2, 4],
    paddingLeft: [1, 2],
    backgroundColor: 'secondary',
    '::before': {
      content: '"* "',
      display: 'inline-block',
      paddingTop: [null, 2]
    }
  }
});

export default styles('styles');
