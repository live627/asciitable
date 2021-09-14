const asciitable = function asciitable(options, data) {
  const pad = function pad(text, length) {
    if (typeof text === "undefined") { text = ""; }
    return `${text}${new Array(Math.max((length - (`${text}`).length) + 1,0)).join(" ")}`;
  };

  if (typeof options === "object" && Array.isArray(options)) {
    const tmp = data;
    data = options;
    options = tmp;
  }

  if (!options) {
    options = {};
  }

  if (!options.intersectionCharacter) {
    options.intersectionCharacter = "-";
  }

  let columns;
  if (options.columns) {
    columns = options.columns;
  } else {
    columns = [];
    data.forEach(e => {
      Object.keys(e).filter(k => !columns.includes(k)).forEach(k => { columns.push(k); });
    });
  }

  columns = columns.map(e => {
    if (typeof e === "string") {
      e = {
        name: e,
        field: e,
      };
    }

    e.width = e.name.length;

    return e;
  });

  data.forEach(e => {
    columns.forEach(column => {
      if (typeof e[column.field] === "undefined") {
        return;
      }

      column.width = Math.max(column.width, (`${e[column.field]}`).length);
    });
  });

  let output = [];

  const separator = [""].concat(columns.map(({width}) => (new Array(width + 1)).join("-"))).concat([""]).join(`-${options.intersectionCharacter}-`);

  output.push(separator);
  output.push([""].concat(columns.map(({name, width}) => pad(name, width))).concat([""]).join(" | "));
  output.push(separator);
  data.forEach(row => {
    output.push([""].concat(columns.map(({field, width}) => pad(row[field], width))).concat([""]).join(" | "));
  });
  output.push(separator);

  if (options.skinny) {
    output = output.map(e => e.replace(/^[ -]/, "").replace(/[ -]$/, ""));
  }

  return output.join("\n");
};

if(typeof module !== "undefined") module.exports = asciitable;
