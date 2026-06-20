export const problems = [
  {
    id: 1,
    hiddenTests: [
      { input: "1 2", output: "3" },
      { input: "10 20", output: "30" },
      { input: "-5 7", output: "2" },
      { input: "0 0", output: "0" },
    ],
  },

  {
    id: 2,
    hiddenTests: [
      { input: "3 4", output: "12" },
      { input: "5 5", output: "25" },
      { input: "-2 3", output: "-6" },
      { input: "0 100", output: "0" },
    ],
  },

  {
    id: 3,
    hiddenTests: [
      {
        input: "5\n1 2 3 4 5",
        output: "5 4 3 2 1",
      },
      {
        input: "3\n10 20 30",
        output: "30 20 10",
      },
      {
        input: "1\n99",
        output: "99",
      },
    ],
  },

  {
    id: 4,
    hiddenTests: [
      {
        input: "5\n1 5 3 9 2",
        output: "9",
      },
      {
        input: "4\n-10 -5 -3 -1",
        output: "-1",
      },
      {
        input: "1\n100",
        output: "100",
      },
    ],
  },

  {
    id: 5,
    hiddenTests: [
      {
        input: "racecar",
        output: "true",
      },
      {
        input: "madam",
        output: "true",
      },
      {
        input: "hello",
        output: "false",
      },
      {
        input: "a",
        output: "true",
      },
    ],
  },

  {
    id: 6,
    hiddenTests: [
      {
        input: "5",
        output: "5",
      },
      {
        input: "10",
        output: "55",
      },
      {
        input: "0",
        output: "0",
      },
      {
        input: "1",
        output: "1",
      },
    ],
  },

  {
    id: 7,
    hiddenTests: [
      {
        input: "5 3",
        output: "2",
      },
      {
        input: "10 20",
        output: "-10",
      },
      {
        input: "-5 -5",
        output: "0",
      },
      {
        input: "0 7",
        output: "-7",
      },
    ],
  },

  {
    id: 8,
    hiddenTests: [
      {
        input: "10 2",
        output: "5",
      },
      {
        input: "100 5",
        output: "20",
      },
      {
        input: "9 3",
        output: "3",
      },
      {
        input: "1 1",
        output: "1",
      },
    ],
  },
];
