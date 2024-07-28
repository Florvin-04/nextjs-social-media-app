import ky from "ky";

const KyInstance = ky.create({
  parseJson: (text) => {
    const data = JSON.parse(text, (key, value) => {
      if (key.endsWith("At")) return new Date(value);
      return value;
    });

    return data;
  },
});

export default KyInstance;
