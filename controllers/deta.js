export const spaceFetch = async (req, res) => {
  try {
    const { surfdrive, surffile } = req.params;
    const { deta } = req;
    const drive = deta.Drive(surfdrive);
    const file = await drive.get(surffile);
    if (!file)
      return res.status(404).json({
        success: false,
        message: `${surffile} not found in ${surfdrive}`,
      });
    res.setHeader("Content-Disposition", `attachment; filename="${surffile}"`);
    const buffer = await file.arrayBuffer();
    res.status(200).send(Buffer.from(buffer));
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error,
    });
  }
};

export const spacePush = async (req, res) => {
  try {
    const { surfdrive } = req.params;
    const { deta } = req;
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }
    const drive = deta.Drive(surfdrive);
    await drive.put(req.file.originalname, {
      data: req.file.buffer,
    });
    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error,
    });
  }
};

export const spaceHole = async (req, res) => {
  const { surfdrive, surffile } = req.params;
  const { deta } = req;
  try {
    const drive = deta.Drive(surfdrive);
    const deletedFile = await drive.delete(surffile);
    res.status(200).json({
      success: true,
      message: `deleted ${surfdrive} / ${deletedFile}`,
    });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: `Request failed! ${error}` });
  }
};
