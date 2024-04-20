use crate::prelude::*;

pub async fn run(ctx: &Context, interaction: &CommandInteraction) -> PotatoBotResult {
    let embed = CreateEmbed::new()
        .title("Potato-Bot help")
        .description("A list of commands for Potato-Bot
                     [Click here for more information](https://docs.bourbonwarfare.com/wiki/welcome-to-bw/potato-bot)")
        .field("/help", "This command", false)
        .field(
            "/docs",
            "A list of various sources of information pertaining to the BW community",
            false,
        )
        .field(
            "/html",
            "The current modlist for BW sessions",
            false,
        )
        .field(
            "/imbatman",
            "Get the latest bat file to launch the BW modlist without A3Launcher",
            false,
        )
        .field(
            "/bwmf",
            "A download link for the latest bwmf release",
            false,
        )
        .field(
            "/handbook",
            "Links to various handbooks for your reference",
            false,
        )
        .field(
            "/issue",
            "A submit an issue for various Potato tools",
            false,
        )
        .field(
            "/upload",
            "Used to upload missions to arma game server mission repos",
            false,
        )
        .field("/orientation", "Request an orientation", false)
        .field(
            "/sessiontime",
            "A tool to help you convert between timezones",
            false,
        )
        .field("/leadership_feedback", "Fill in some fields and output a template for easy formatting", false);

    if let Err(e) = create_response_embed!(ctx, interaction, embed, true) {
        let _ = PotatoBotError::Discord(e)
            .send_error_response(ctx, interaction)
            .await;
    };

    Ok(())
}

pub fn register() -> CreateCommand {
    CreateCommand::new("help").description("Get help with the bot")
}
