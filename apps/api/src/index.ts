import pageCreationService from "./services/PageCreationService";

const pages = {
  templateId: "d0947a7dd4c547af9e873bc412c09541",
  databaseId: "69c5f45fed5243039c394a8f95587e06",
};

(async () => {
  const id = await pageCreationService.getLastDocumentId(pages.databaseId);
  const newCreatedPageId = await pageCreationService.createPageInsideDatabase(
    pages.databaseId
  );

  const blocksToCopy = [
    { id: pages.templateId, name: "Daily Tasks" },
    { id: id, name: "Tomorrow Tasks" },
    { id: pages.templateId, name: "Actions" },
    { id: pages.templateId, name: "What happened today?" },
  ];

  for (const block of blocksToCopy) {
    await pageCreationService.insertTaskBlock(
      block.id,
      newCreatedPageId,
      block.name
    );
  }
})();
