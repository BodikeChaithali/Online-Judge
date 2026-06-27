import Draft from "../models/draftModel.js";

export const saveDraft = async (req, res) => {
  try {
    const email = req.user.email;
    const { problemId, language, code, lastLanguage } = req.body;

    if (!problemId || !language) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }

    const draft = await Draft.findOneAndUpdate(
      {
        email,
        problemId,
      },
      {
        $set: {
          [`drafts.${language}`]: code,
          lastLanguage: lastLanguage || language,
        },
      },
      {
        new: true,
        upsert: true,
      },
    );

    res.json({
      success: true,
      draft,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export const getDraft = async (req, res) => {
  try {
    const email = req.user.email;
    const { problemId } = req.params;
    const draft = await Draft.findOne({
      email,
      problemId,
    });

    res.json({
      success: true,
      draft,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export const deleteLanguageDraft = async (req, res) => {
  try {
    const email = req.user.email;
    const { problemId, language } = req.body;

    await Draft.findOneAndUpdate(
      {
        email,
        problemId,
      },
      {
        $unset: {
          [`drafts.${language}`]: "",
        },
      },
    );

    res.json({
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
