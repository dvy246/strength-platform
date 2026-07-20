# OpenCode Is Powerful. That's Exactly the Problem.

*OpenCode is the free, open source alternative to Claude Code, with full shell access to match. Here's how I ran it safely using a sandbox instead of my laptop.*

---

OpenCode is an open-source coding agent with a workflow similar to Claude Code.

You type what you want, it reads your codebase, edits files, runs shell commands on its own. Same basic idea as Claude Code. Free though, open source, and you're not locked into one model.

Which is great, until you actually sit with what "runs shell commands on its own" means.

**The first time you hand a terminal agent that kind of access, there's one question you can't quite shake:** what happens the moment it runs something you didn't expect?

Most people pick a folder they don't care about and hope for the best. Or they don't think about it at all until something breaks.

I didn't love either option, so before I let OpenCode near anything that mattered, I went looking for a third one.

---

That's how I ended up moving the agent's shell into a disposable sandbox from [Tensorlake](https://www.tensorlake.ai/), that runs these as a cloud service, while leaving everything else right where it was on my laptop.

```other
Your Laptop
      │
      ▼
   OpenCode
      │
      ▼
Tensorlake Plugin
      │
      ▼
 Disposable Linux Sandbox
```

Here's what that looked like, and what actually surprised me once I had it running.

---

## What I Kept Picturing Before I Typed Anything

A coding agent's real risk has nothing to do with intelligence. Most of the time it gets things right. What it doesn't do is pause. It doesn't stop to double-check whether the command it's about to fire off is the one you actually meant to approve.

One scenario kept nagging at me before I typed anything. I ask it to clean up build artifacts, and it runs `rm -rf ./build`. Except `./build` turns out to be a symlink into somewhere I still needed, the kind of thing an agent skims right past, and honestly, the kind of thing I don't always catch either when I'm moving fast.

Or I ask it to install a dependency. `npm install` fires a postinstall script. That script rewrites a config file I never agreed to touch. I've seen postinstall scripts do weirder things than that with a human sitting right there watching.

Neither one is a bug to be honest. 

That's just what shell access does when nothing stands between a command and your machine.

Then I thought bigger than my own laptop. Same agent, but now it's refactoring a production monorepo that ten other engineers are actively pushing commits to. Same misread symlink. Same rogue postinstall script. Except now it's not just my afternoon on the line.

`bash`, `write`, `edit`. These aren't agent-specific features. They're shell and filesystem access, handed to a process making its own calls about what to run next.

The instinct is to fix this with more caution. Review every diff. Approve every command. That works right up until it doesn't, because the entire point of an autonomous agent is that you eventually stop reviewing every single step.

The real fix turned out to be a different blast radius. 

Put the agent's commands somewhere disposable instead of on my machine, and now a bad command won't harm my system.

Running locally isn't wrong, to be clear. For a throwaway project, or a workflow you already trust, it's exactly what you want. What changes the math is pointing autonomous shell access at something a mistake would actually cost you.

---

## Brain Local, Hands in a Sandbox

One table covers the whole shift. The wiring behind it takes a little longer to explain.

|                       | **Local OpenCode**         | **OpenCode + Tensorlake** |
| --------------------- | -------------------------- | ------------------------- |
| Commands run          | On your laptop             | Remotely, in a sandbox    |
| Filesystem            | Your actual filesystem     | Isolated, disposable      |
| Dependencies          | Whatever's on your machine | Disposable environment    |
| A bad command affects | Your machine               | The sandbox, not you      |

That's the outcome. The wiring is simpler than it sounds.

Tensorlake ships a plugin called [`tensorlake-opencode`](https://www.npmjs.com/package/tensorlake-opencode). The plugin doesn't replace OpenCode.It intercepts specific tool calls and reroutes them. Once I actually understood that distinction, the idea turned out simpler than I expected.

OpenCode on your laptop, tools in a sandbox, that's the actual shape of it. The OpenCode harness itself, the interface, your session, all of that keeps running on your machine exactly like before.

The model call still goes out to whichever provider you've configured, Anthropic, OpenAI, whoever, the same as it always did; that part was never local to begin with, and this plugin doesn't change it.

What changed was where each individual tool call landed:

```other
                Your Laptop
                     │
                     ▼
          OpenCode Harness
                     │
      ┌──────────────┴──────────────┐
      ▼                             ▼
Model Provider              Tensorlake Sandbox
(Claude/OpenAI/etc.)      Shell + Filesystem
```

> The model call still goes wherever you configured your provider. Only the tool calls, the hands, move into the sandbox.

`webfetch` and `websearch` are the two exceptions that stay local, since neither touches a filesystem. `bash`, `write`, `edit`, `read`, `ls`, `glob`, and `grep` are the ones that get rerouted.

Every intercepted command now makes a network round trip instead of running instantly on my machine. Tensorlake's documentation says a sandbox starts up in a few seconds, with the underlying VM image itself booting in hundreds of milliseconds. Their GitHub page and product site separately claim resume from a suspended state also lands under a second. My own first sandbox, the one the plugin spun up automatically on that `uname -a` call, took 2.3 seconds end to end, per the timestamp the plugin logged, which fits comfortably inside what the docs describe. That's likely the plugin's own provisioning and connection overhead stacked on top of the raw VM boot, not just the VM starting up. Either way, it's not something you sit around waiting on.

---

## Setting It Up

The whole setup turned out to be one config entry and one environment variable, typed in this order.

First, the plugin, added to `~/.config/opencode/opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["tensorlake-opencode"]
}
```

OpenCode installs it automatically, no separate `npm install` needed. Then the API key, exported in the same shell I was about to launch OpenCode from:

```bash
export TENSORLAKE_API_KEY=your_api_key_here
opencode
```

Nothing happened. No sandbox spun up on launch, which threw me for a second. First instinct was that I'd messed up the config somehow, and I almost went back to check the JSON for a typo before actually rereading what I'd just set up: lazy creation, not eager. Tailing `~/.local/share/opencode/log/tensorlake.log` just confirmed the plugin had loaded, nothing more, until I actually asked the agent to do something that needed a sandbox.

---

## The First Real Test

Sandbox creation in this plugin is lazy. It waits for the first tool call that actually needs the filesystem or a shell, not the moment you launch the session.

I didn't want to point it at anything that mattered yet, so the first command I actually gave it was about as low-stakes as they come:

```other
Run: uname -a
```

That single `bash` call was what triggered everything. A "Sandbox created" toast showed up in the terminal, and I had the log tailing in a second window the whole time. It read almost exactly what the docs describe: a line saying a new sandbox was being created for the session, then a second line confirming it was live, at 2.3 seconds.

The output said Linux. My laptop runs macOS. Not going to lie, that one word convinced me faster than any architecture diagram would have.

**Next I asked it to prove the filesystem side too:**

```other
Write "Hello Tensorlake" to /tmp/workspace/test.txt, then read it back.
```

The write and read both happened entirely inside the sandbox, confirming that filesystem operations were isolated from my machine.

`/tmp/workspace` was the agent's working directory inside the sandbox, not a folder anywhere on my disk. Nothing in either test would have cost me anything if it had gone wrong.

With the sandbox working, I wanted to move beyond smoke tests and verify the full developer workflow on a real repository.

```other
Clone https://github.com/benjaminp/six.git, find the ensure_str function, 
improve its TypeError message so it names the function it came from, 
then run the test suite and tell me if anything broke.
```

This was intentionally a tiny change—the goal wasn't to contribute a feature, but to verify that OpenCode could complete the same edit–test loop I'd expect during normal development.

`six` is a small, well-known Python compatibility library: one source file, a straightforward test suite, and just enough structure to exercise a realistic edit–test workflow. 

OpenCode cloned the repository, located `ensure_str`, modified the function, and ran the test suite entirely inside the sandbox.

The original implementation raised `TypeError("not expecting type '%s'" % type(s))`.

The edit made it `TypeError("ensure_str: not expecting type '%s'" % type(s))`—a deliberately small edit that was easy to verify with the existing test suite. Because the tests only verify that a `TypeError` is raised rather than checking the exact message text, this made for a safe, minimal edit, and the run confirmed it: 184 passed, 16 skipped, 0 failed. 

Same as before the change.

That's the part that mattered to me. Not the specific repo or the specific one-line fix, but that a clone, a real edit, and a full test run all happened inside the sandbox, on an actual project, without me once worrying about what would happen to my own machine if something in that chain went sideways.

---

## Three Things That Clicked Once It Was Running

I expected the isolation. The other two took me by surprise.

**Isolation.** A bad command genuinely has nowhere real to land. A runaway install, an `rm` aimed at the wrong path, a dependency that half-installs and leaves things broken. All of it happens in a sandbox I can throw away, not my actual working tree.

**Reproducibility** mattered more once I pictured someone else on the team running this same setup. Whatever's actually installed on my laptop stops being relevant, because the agent isn't running on my laptop anymore. Register one image with the right toolchain baked in, point every future session at it, and the "works on my machine" conversation just stops happening.

Then there's **persistence**, the one I hadn't planned for. A named sandbox doesn't vanish when OpenCode restarts. It just sits there, parked. Come back later and the same working directory, the same installed packages, the same warm caches are all still exactly where I left them. Nothing rebuilt, nothing reinstalled.

A disposable CI container vanishes the second a run finishes. This one was still there the next day, same as I'd left it.

Took me an hour of lost installed state before that actually registered.

---

## Configuring the Sandbox for Real Work

Once I trusted it with something more than a test file, I went back and actually sized it properly. The plugin reads a small set of environment variables once, at the moment the first sandbox gets created, so they need to be set before you launch OpenCode, not after:

```bash
export TENSORLAKE_CPUS=4
export TENSORLAKE_MEMORY_MB=8192
export TENSORLAKE_DISK_MB=20480
export TENSORLAKE_IMAGE=my-custom-image
```

| **Variable**           | **Default**      | **Controls**                     |
| ---------------------- | ---------------- | -------------------------------- |
| `TENSORLAKE_CPUS`      | 2                | vCPUs                            |
| `TENSORLAKE_MEMORY_MB` | 4096             | RAM in MB                        |
| `TENSORLAKE_DISK_MB`   | 10240            | Disk in MB                       |
| `TENSORLAKE_IMAGE`     | platform default | The image the sandbox boots from |

If you're using a Personal Access Token instead of a project-scoped key, you'll also need `TENSORLAKE_ORGANIZATION_ID` and `TENSORLAKE_PROJECT_ID`.

`TENSORLAKE_IMAGE` is the one actually worth using. Bake your language runtime, system packages, and project dependencies into a registered image once:

```bash
tl sbx image create Dockerfile --registered-name my-custom-image
export TENSORLAKE_IMAGE=my-custom-image
```

Every session after that starts already warm. I stopped watching the agent reinstall my stack from scratch every time I opened a new session.

*Note: `export` only lasts for the current shell, so I added these to my shell profile once I knew I'd be using this setup regularly.*

---

## The Operational Questions I Actually Had

Before trusting this with anything real, I wanted answers to a few things that don't come up in a quick demo. Worth being upfront about one thing here: most of what follows is documented at the Tensorlake SDK and platform level. I haven't confirmed that the OpenCode plugin specifically exposes or manages each of these the same way, only that the underlying sandboxes it creates support them. Where that distinction matters, I've called it out below.

**What if I just walk away mid-session?** Named sandboxes auto-suspend after their idle timeout rather than terminating, at the platform level. Tensorlake's product site says the meter stops the moment it suspends, and their GitHub page puts resume at under a second, with filesystem, memory, and running processes exactly where you left them, not rebuilt. I haven't independently timed a resume myself, and I haven't confirmed whether the OpenCode plugin surfaces any control over this behavior or just inherits the platform default, so take the specific number as Tensorlake's claim about the platform, not a tested claim about this plugin.

**What if the agent kicks off something long-running, like a build or a test suite?** The underlying Tensorlake SDK supports starting background processes inside a sandbox that outlive the single command that launched them. I haven't tested whether the OpenCode plugin's `bash` interception uses this pattern specifically, or whether a long-running command inside OpenCode just holds the tool call open for the duration. Either way, the sandbox itself isn't the bottleneck.

**What if my connection drops mid-command?** Tensorlake has written publicly about this exact failure mode at the platform level: when the transport hiccups mid-run, they retry and reap orphaned sandboxes so a flaky connection doesn't cost you the whole task. Again, this is a platform-level guarantee. I haven't tested how the plugin itself behaves if your local connection drops mid-tool-call.

**What if the sandbox itself crashes outright, not just an idle timeout?** Here's where I'll be straight with you: I didn't find documentation covering a hard crash mid-command specifically, at either the platform or plugin level, and I didn't manage to force one during testing either. If you're planning to run this against something you really can't afford to lose, that's worth confirming directly with Tensorlake rather than taking my word for it.

---

## Where I'd Actually Use This

By the end I had a rough rule for myself. Picture a coding agent refactoring a production monorepo while another engineer is pushing commits at the same time. The question was never whether the model was smart enough. It was whether I wanted its shell commands landing on my own workstation.

This isn't the right setup for every OpenCode session, and I don't pretend otherwise:

| **My situation**                                        | **What I'd do** |
| ------------------------------------------------------- | --------------- |
| Personal throwaway project                              | Run locally     |
| Client repository                                       | Use Tensorlake  |
| Production codebase                                     | Use Tensorlake  |
| Letting the agent experiment freely with shell commands | Use Tensorlake  |
| Shared engineering environment                          | Use Tensorlake  |

The sandbox earns its place anywhere the blast radius of a wrong command actually matters. If I'm the only person who'll ever touch the repo and I'd shrug off losing it, I'm solving a problem I don't have yet.

Worth a quick word on why this isn't just Docker or a Codespace with extra steps. A Docker container shares your host's kernel, which is fine for packaging an app but a thinner isolation boundary than a full VM if you're worried about what an autonomous agent might run. 

A local VM gives you the stronger boundary but is heavy and slow to spin up and tear down for something you might want to throw away every few minutes. GitHub Codespaces and Dev Containers solve a different problem: a consistent, persistent dev environment tied to a specific repo, not a fast, disposable environment built to be created and discarded on every session. 

The MicroVM approach here is closer to a VM's isolation with something closer to a container's boot speed, and it's built specifically to be thrown away.

---

## If You Want to Try This Yourself

Here's the order I'd do it in, knowing what I know now.

**Step 1:** Install OpenCode, add `tensorlake-opencode` to `opencode.json`. This just gets the plugin loaded, nothing else happens yet.

**Step 2:** Export `TENSORLAKE_API_KEY`, launch OpenCode, confirm the plugin loaded via the log file. This is the "is it actually on" check.

**Step 3:** Ask it to run something trivial, like `uname -a`. This is what triggers sandbox creation and gives you visible proof the command ran remotely.

**Step 4:** Set `TENSORLAKE_CPUS`, `TENSORLAKE_MEMORY_MB`, and `TENSORLAKE_DISK_MB` to match your real workload, before your next session starts, not mid-session.

**Later:** Build a custom image with your actual toolchain baked in, once the default image starts feeling like it's missing things you keep reinstalling.

---

## Closing

I went looking for a third option: an agent with full autonomy, running somewhere that wasn't my laptop. Got that part working fast. What actually surprised me was how little I had to think about afterward.

I stopped reading every command before approving it once this was running. Wasn't carelessness. Just nothing left on my machine for a bad command to reach.

Turns out the part that mattered was never whether the agent could run commands. It was where they landed. Not stopping mistakes. Just making sure they happen somewhere disposable instead of somewhere that costs me.

If you've started letting an autonomous coding agent anywhere near your shell, moving that shell execution into a disposable sandbox is one of the highest-leverage changes you can make, and Tensorlake's own numbers put the setup at a few minutes, not an afternoon. The config entry and the environment variable up above are the whole thing.

---

## References

- [Tensorlake OpenCode Integration](https://docs.tensorlake.ai/sandboxes/opencode): Full setup, configuration, and lazy sandbox creation model
- [OpenCode](https://opencode.ai): The open source, terminal-first coding agent, MIT-licensed and model-agnostic
- [tensorlake-opencode on npm](https://www.npmjs.com/package/tensorlake-opencode): The plugin package referenced in this article
- [Plugin source on GitHub](https://github.com/tensorlakeai/opencode-tensorlake-plugin): Tool interceptors, session manager, lifecycle handling
- [Tensorlake Sandbox Lifecycle](https://docs.tensorlake.ai/sandboxes/lifecycle): The suspend, resume, and snapshot model underneath this integration
- [Tensorlake Sandbox Images](https://docs.tensorlake.ai/sandboxes/images): Building and registering a custom image

---