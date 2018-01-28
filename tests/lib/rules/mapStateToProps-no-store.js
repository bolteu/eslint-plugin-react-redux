require('babel-eslint');

const rule = require('../../../lib/rules/mapStateToProps-no-store');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 6,
  sourceType: 'module',
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
  },
};

const ruleTester = new RuleTester({ parserOptions });

ruleTester.run('mapStateToProps-no-store', rule, {
  valid: [
    'export default function observeStore(store) {return store;}',
    'export default connect(() => {})(Alert)',
    'export default connect(() => {})(Alert)',
    'export default connect(null, null)(Alert)',
    'connect((state) => ({isActive: state.isActive}), null)(App)',
    `connect(
          (state) => {
              return {
                  isActive: state.isActive
              }
          },
          null
        )(App)
    `,
    `connect(function(state){
              return {
                  isActive: state.isActive
              }
          },
          null
        )(App)
    `,
    `function mapStateToProps(state) {
      return {};
    }`,
    `const mapStateToProps = function(state) {
      return state.isActive;
    }`,
    'const mapStateToProps = (state, ownProps) => {}',
    'const mapStateToProps = (state) => {isActive: state.isActive}',
    `const mapStateToProps = (state, ownProps) => {};
      connect(mapStateToProps, null)(Alert);`,
  ],
  invalid: [{
    code: 'const mapStateToProps = (state) => state',
    errors: [
      {
        message: 'mapStateToProps should not return complete store object',
      },
    ],
  }, {
    code: `const mapStateToProps = state => {
            return {state: state}
          }`,
    errors: [
      {
        message: 'mapStateToProps should not return complete store object',
      },
    ],
  }, {
    code: `function mapStateToProps(state) {
      return state;
    }`,
    errors: [
      {
        message: 'mapStateToProps should not return complete store object',
      },
    ],
  }, {
    code: `export default connect(
        (state) => {
            return {
                state: state
            }
        },
        (dispatch) => {
            return {
                actions: bindActionCreators(actions, dispatch)
            }
        }
    )(App)`,
    errors: [
      {
        message: 'mapStateToProps should not return complete store object',
      },
    ],
  }, {
    code: 'connect((state) => state, null)(App)',
    errors: [
      {
        message: 'mapStateToProps should not return complete store object',
      },
    ],
  }, {
    code: `const mapStateToProps = (state, ownProps) => state;
      connect(mapStateToProps, null)(Alert);`,
    errors: [
      {
        message: 'mapStateToProps should not return complete store object',
      },
    ],
  }],
});