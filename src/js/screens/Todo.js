import Component from '../components/Component';
import jsx from '../render/jsx';

export default class Todo extends Component {
  state = {
    term: '',
    items: [],
  };

  render() {
    return jsx`
      <div class="todo-list">
        <div>
          <form onSubmit="${this.onSubmit}">
            <input value="${this.state.term}" onkeyup="${this.onChange}" />
            <button>Submit</button>
          </form>
          <p>Items</p>
          <ul>${this.state.items.map(item => jsx`<li>${item}</li>`)}</ul>
        </div>
      </div>
    `;
  };

  onChange = (event) => this.setState({term: event.target.value});

  onSubmit = (event) => {
    event.preventDefault();

    this.setState({
      term: '',
      items: [...this.state.items, this.state.term]
    });
  };
}
