import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Split from 'react-split';
import { EditorPane } from '@/components/editor/editor-pane';
import { PreviewPane } from '@/components/preview/preview-pane';
import { ChatInterface } from '@/components/chat/chat-interface';
import { FileManager } from '@/components/file-manager/file-manager';
import { TerminalPane } from '@/components/terminal/terminal-pane';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PanelLeftClose, PanelLeftOpen, MessageSquare, Terminal } from 'lucide-react';

export function EditorPage() {
  const { projectId } = useParams();
  const [showFileManager, setShowFileManager] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const [showTerminal, setShowTerminal] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);

  return (
    <div className="flex h-full flex-col">
      <Split
        className="flex h-full"
        sizes={[20, 60, 20]}
        minSize={[200, 300, 300]}
        expandToMin
        gutterAlign="center"
        snapOffset={30}
        dragInterval={1}
        direction="horizontal"
      >
        <div className="flex h-full border-r border-border/40">
          {showFileManager && (
            <div className="h-full w-full overflow-auto">
              <FileManager />
            </div>
          )}
          {!showFileManager && (
            <div className="flex h-full w-10 items-center justify-center border-r border-border/40">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowFileManager(true)}
              >
                <PanelLeftOpen className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="flex h-full flex-col">
          <Split
            className="flex flex-1 flex-col"
            sizes={[100]}
            minSize={[300]}
            direction="vertical"
          >
            <div className="flex-1 overflow-hidden">
              <EditorPane />
            </div>

            {showTerminal && (
              <div className="border-t border-border/40">
                <TerminalPane />
              </div>
            )}
          </Split>

          <div className="flex gap-2 border-t border-border/40 p-2">
            <Button
              variant={showChat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowChat(!showChat)}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Chat
            </Button>
            <Button
              variant={showTerminal ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowTerminal(!showTerminal)}
            >
              <Terminal className="mr-2 h-4 w-4" />
              Terminal
            </Button>
            <div className="flex-1" />
            <Button
              variant={isPreviewVisible ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsPreviewVisible(!isPreviewVisible)}
            >
              {isPreviewVisible ? 'Hide Preview' : 'Show Preview'}
            </Button>
          </div>
        </div>

        <div className="flex h-full border-l border-border/40">
          {isPreviewVisible && (
            <div className="flex-1">
              <PreviewPane />
            </div>
          )}

          {showChat && !isPreviewVisible && (
            <div className="flex-1">
              <ChatInterface />
            </div>
          )}
        </div>
      </Split>

      {showChat && (
        <div className="border-t border-border/40">
          <ChatInterface />
        </div>
      )}
    </div>
  );
}
