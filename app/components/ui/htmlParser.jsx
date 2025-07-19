import parse from 'html-react-parser';

export default function HtmlParser({children}) {
  return parse(children)
}
